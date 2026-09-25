#!/usr/bin/env python3
"""从维护者源仓库构建可分发的干净 Obsidian 模板。

    python3 scripts/build_template.py --out ../life-os-releases --name Candidate --version 1.1.0 --zip
    python3 scripts/build_template.py --out ../life-os-releases --name CandidateLite --version 1.1.0 --without-reading

不会反写源仓库。构建时排除私人内容和机器状态，恢复审核过的默认值，
写入版本和初始工作区，验证后可选择生成 ZIP。详见 scripts/RELEASE.md。
"""
import argparse, fnmatch, json, os, re, shutil, stat, subprocess, sys, hashlib, zipfile, datetime, tempfile
from pathlib import Path

HERE = os.path.dirname(os.path.abspath(__file__))
LIVE = os.path.dirname(HERE)

DROP_GLOBS = [
    ".directory", ".github", ".github/*",
    ".agents", ".agents/*", ".specify", ".specify/*", "specs", "specs/*", ".venv", ".venv/*",
    "指南/18 Distribution Checklist.md", "指南/23 原生验收.md", "指南/来源 - 视频分析.md",
    ".git", ".git/*", ".vault-meta", ".vault-meta/*", ".raw", ".raw/*", ".trash", ".trash/*",
    ".claude/settings.local.json", ".mcp.json", ".obsidian/workspace*.json", ".obsidian/graph.json",
    ".obsidian/plugins/agent-client/sessions", ".obsidian/plugins/agent-client/sessions/*",
    ".obsidian/plugins/*/data.json.bak", "元数据/Agent Chats", "元数据/Agent Chats/*", "Agent Client", "Agent Client/*",
    "scripts/template", "scripts/template/*", "scripts/locale_audit.py", "scripts/build_template.py",
    "scripts/RELEASE.md", "scripts/verify_*", "CHANGELOG.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md",
    "build", "build/*",
    "wiki/concepts", "wiki/concepts/*", "wiki/sources", "wiki/sources/*", "wiki/entities", "wiki/entities/*", "wiki/questions", "wiki/questions/*", "wiki/log/*", "inbox/*",
    "Untitled*", "*/Untitled*", "*.canvas", ".DS_Store", "*/.DS_Store", "Thumbs.db", "*/Thumbs.db",
    "__pycache__", "*/__pycache__", "*.pyc", "*.png.bak", "*.html", "*.log",
]
USER_CONTENT = ["01 日记/", "02 静修/", "04 项目/", "05 人物/", "06 写作/", "07 资料库/",
                "09 阅读/章节/", "09 阅读/经文/", "09 阅读/研读笔记/", "09 阅读/主题/"]
BOARD_DEFAULTS = {
    "04 项目/项目看板.md": "项目看板",
    "06 写作/通讯/通讯看板.md": "通讯看板",
    "06 写作/YouTube 脚本/YouTube 看板.md": "视频看板",
    "06 写作/文章/文章看板.md": "文章看板",
    "06 写作/课程内容/课程看板.md": "课程看板",
}
READING_PATHS = ["09 阅读", "指南/07 工作流 - 每日阅读.md", "scripts/bible_books.py", "scripts/generate_reading_plan.py", "scripts/split_bible.py", "模板/研读笔记.md"]

def dropped(rel):
    if rel.startswith(".claude/"):
        return rel != ".claude/settings.json"
    if rel.startswith("元数据/附件/"):
        return not (os.path.basename(rel) in (".gitkeep",) or os.path.basename(rel).startswith("cover."))
    return any(fnmatch.fnmatch(rel, g) for g in DROP_GLOBS)

def has_example_tag(path):
    try:
        with open(path, encoding="utf-8") as stream:
            head = stream.read(4000)
    except Exception:
        return False
    m = re.match(r"^---\n(.*?)\n---", head, re.S)
    return bool(m) and re.search(r"^\s*-\s*example\s*$", m.group(1), re.M) is not None

def copy_tree(live, out):
    for root, dirs, files in os.walk(live):
        rel_root = os.path.relpath(root, live).replace("\\", "/")
        rel_root = "" if rel_root == "." else rel_root
        dirs[:] = [d for d in dirs if not dropped(f"{rel_root}/{d}" if rel_root else d)]
        if any(os.path.islink(os.path.join(root, d)) for d in dirs):
            raise ValueError("Package source contains a symbolic-link directory")
        for f in files:
            rel = f"{rel_root}/{f}" if rel_root else f
            if dropped(rel):
                continue
            source = os.path.join(root, f)
            if os.path.islink(source) or not stat.S_ISREG(os.stat(source).st_mode):
                raise ValueError("Package source contains a non-regular file")
            default = Path(HERE, "template", "defaults", rel)
            if default.is_file():
                # Never stage personal values before replacing them with defaults.
                continue
            if rel.startswith(("03 规划/", "08 任务/", "wiki/")):
                # Only reviewed defaults populate these personal-state folders.
                continue
            if rel.startswith(".obsidian/") and not rel.startswith(".obsidian/plugins/"):
                name = rel.removeprefix(".obsidian/")
                settings = None
                if name == "app.json": settings = {"newFileLocation": "current"}
                elif name == "appearance.json": settings = {"enabledCssSnippets": ["lifeos", "vault-colors"]}
                elif name in ("types.json", "webviewer.json"): settings = {}
                elif name == "core-plugins.json":
                    original = json.loads(Path(source).read_text(encoding="utf-8"))
                    if not isinstance(original, dict): raise ValueError("Unsupported core plugin settings")
                    settings = {key: value for key, value in original.items() if isinstance(value, bool)}
                    settings["sync"] = False
                elif name == "community-plugins.json":
                    original = json.loads(Path(source).read_text(encoding="utf-8"))
                    if not isinstance(original, list) or any(not isinstance(value, str) or not re.fullmatch(r"[a-z0-9-]+", value) for value in original):
                        raise ValueError("Unsupported plugin inventory")
                    settings = original
                elif name == "hotkeys.json":
                    original = json.loads(Path(source).read_text(encoding="utf-8"))
                    allowed_hotkeys = {
                        "life-os-app:open-home", "life-os-app:open-capture",
                        "quickadd:choice:lifeos-daily", "quickadd:choice:lifeos-weekly",
                        "quickadd:choice:lifeos-quarterly", "quickadd:choice:lifeos-journal",
                        "quickadd:choice:lifeos-win", "quickadd:choice:lifeos-gratitude",
                        "quickadd:choice:lifeos-task",
                        "templater-obsidian:模板/每日问题提示.md",
                    }
                    settings = {key: value for key, value in original.items() if key in allowed_hotkeys}
                if settings is not None:
                    target = Path(out, rel)
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_text(json.dumps(settings, indent=2), encoding="utf-8")
                continue
            if rel in BOARD_DEFAULTS:
                target = Path(out, rel)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text("---\nkanban-plugin: board\n---\n\n# " + BOARD_DEFAULTS[rel] + "\n\n## 想法\n\n## 进行中\n\n## 已完成\n", encoding="utf-8")
                continue
            if rel.startswith(".obsidian/plugins/") and f != "data.json" and f not in ("main.js", "manifest.json", "styles.css", "LICENSE"):
                continue
            if rel.startswith(".obsidian/plugins/") and f == "data.json":
                # Never copy raw machine state into staging, even temporarily.
                settings = safe_plugin_settings(rel.split("/")[2], source)
                if settings is not None:
                    dst = os.path.join(out, rel)
                    os.makedirs(os.path.dirname(dst), exist_ok=True)
                    with open(dst, "w", encoding="utf-8") as target:
                        json.dump(settings, target, indent=2)
                continue
            if any(rel.startswith(u) for u in USER_CONTENT):
                if not rel.endswith(".md") or not has_example_tag(os.path.join(root, f)):
                    continue
            if rel == ".claude/settings.json":
                original = json.loads(Path(source).read_text(encoding="utf-8"))
                allow = (original.get("permissions") or {}).get("allow")
                if not isinstance(allow, list) or not allow or any(not isinstance(command, str) or not command.startswith("mcp__obsidian__") or any(word in command for word in ("write", "append", "patch", "delete", "move", "copy", "execute")) for command in allow):
                    raise ValueError("Unsafe Claude Code permissions in source settings")
                target = Path(out, rel)
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(json.dumps({"permissions": {"allow": allow, "deny": []}}, indent=2) + "\n", encoding="utf-8")
                continue
            if rel == ".claude-obsidian.json":
                target = Path(out, rel)
                target.write_text(json.dumps({"legacy_raw": ".raw", "role": "vault", "schema": "claude-obsidian.workspace.v1", "source_inbox": "inbox", "vault": "."}, indent=2) + "\n", encoding="utf-8")
                continue
            dst = os.path.join(out, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(os.path.join(root, f), dst)

def safe_plugin_settings(plugin, source):
    fixed = {
        "obsidian-local-rest-api": {"enableInsecureServer": True},
        "agent-client": {"savedSessions": [], "autoAllowPermissions": False, "customAgents": [], "presetAgents": {}, "autoMentionActiveNote": False, "expandWikilinkContext": False},
        "seo": {"scanDirectories": "06 写作", "checkExternalLinks": False},
        "omnisearch": {"httpApiEnabled": False, "DANGER_httpHost": None},
        "life-os-app": {},
    }
    if plugin in fixed:
        return fixed[plugin]
    allowed = {
        "dataview": ["enableDataviewJs", "enableInlineDataviewJs", "enableInlineDataview", "refreshEnabled", "refreshInterval"],
        "templater-obsidian": ["data_version", "templates_folder", "trigger_on_file_creation_mode", "trigger_on_file_creation", "folder_templates", "enabled_templates_hotkeys", "syntax_highlighting", "syntax_highlighting_mobile"],
        "periodic-notes": ["daily", "weekly", "monthly", "quarterly", "yearly", "hasMigratedDailyNoteSettings", "hasMigratedWeeklyNoteSettings"],
        "quickadd": ["choices", "templateFolderPaths", "migrations", "version"],
        "obsidian-tasks-plugin": ["globalQuery", "globalFilter", "removeGlobalFilter", "taskFormat", "setCreatedDate", "setDoneDate", "setCancelledDate", "recurrenceOnNextLine"],
        "obsidian-kanban": ["kanban-plugin", "show-checkboxes", "lane-width", "date-format", "time-format"],
    }
    if plugin not in allowed:
        return None
    with open(source, encoding="utf-8") as stream:
        original = json.load(stream)
    def clean(value):
        if isinstance(value, dict):
            return {k: clean(v) for k, v in value.items() if not re.search(r"secret|token|password|api.?key|authorization|certificate|private.?key|^env$", k, re.I)}
        if isinstance(value, list):
            return [clean(v) for v in value]
        if isinstance(value, str) and re.search(r"BEGIN (?:RSA |PRIVATE |CERTIFICATE)|\b(?:sk-|ghp_|xoxb-)[A-Za-z0-9_-]{8,}|Bearer\s+\S{16,}", value):
            raise ValueError("Sensitive value detected in allowlisted settings; nothing written")
        return value
    result = clean({k: original[k] for k in allowed[plugin] if k in original})
    if plugin == "quickadd":
        result.update(disableOnlineFeatures=True, ai={"providers": []}, globalVariables={})
    return result

def validate_destination(live, output_root, name):
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", name) or name in (".", ".."):
        raise ValueError("Build name must be one plain directory name")
    raw = Path(output_root).absolute()
    if any(p.is_symlink() for p in [raw, *raw.parents]):
        raise ValueError("Output paths must not contain symbolic links")
    source = Path(live).resolve(strict=True)
    parent = raw.resolve()
    destination = parent / name
    if parent == source or parent in source.parents or source in parent.parents:
        raise ValueError("Output root must be outside the live vault and its ancestors")
    if destination.exists() or destination.is_symlink():
        raise ValueError("Destination already exists; choose a fresh output name")
    return source, parent, destination

def reset_defaults(out):
    src = os.path.join(HERE, "template", "defaults")
    required = ["元数据/Compass 配置.md", "03 规划/人生主题.md", "03 规划/核心价值观.md", "03 规划/理想一周.md", "08 任务/任务总表.md"]
    if any(not Path(src, rel).is_file() or Path(src, rel).is_symlink() for rel in required):
        raise ValueError("Clean source defaults are missing or unsafe")
    for root, _, files in os.walk(src):
        for f in files:
            if Path(root, f).is_symlink():
                raise ValueError("Defaults must not contain symlinks")
            rel = os.path.relpath(os.path.join(root, f), src)
            dst = os.path.join(out, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(os.path.join(root, f), dst)

def json_surgery(out):
    def load(rel):
        p = os.path.join(out, rel)
        if not os.path.exists(p):
            return p, None
        with open(p, encoding="utf-8") as stream:
            return p, json.load(stream)
    def save(p, d):
        with open(p, "w", encoding="utf-8") as stream:
            json.dump(d, stream, indent=2, ensure_ascii=False)
            stream.write("\n")
    p, d = load(".obsidian/plugins/obsidian-local-rest-api/data.json")
    save(p, {"enableInsecureServer": True})
    p, d = load(".obsidian/plugins/agent-client/data.json")
    if d is not None:
        for k in ["savedSessions", "lastUsedModels", "lastUsedModes", "lastUsedConfigOptions", "floatingWindowPosition", "floatingButtonPosition", "floatingWindowSize", "nodePath"]:
            d.pop(k, None)
        d["savedSessions"] = []; d["autoAllowPermissions"] = False
        for pid, pa in (d.get("presetAgents") or {}).items():
            if isinstance(pa, dict):
                pa["command"] = pa.get("command", "") if not str(pa.get("command", "")).startswith("/") else ""
                pa.pop("env", None); pa["env"] = {}
                for k in list(pa.keys()):
                    if "secret" in k.lower() or "apikey" in k.lower(): pa[k] = ""
        d["customAgents"] = []
        save(p, d)
    p, d = load(".obsidian/plugins/seo/data.json")
    if d is not None:
        d.pop("cachedGlobalResults", None); d.pop("lastScanTimestamp", None)
        d["scanDirectories"] = "06 写作"; d["checkExternalLinks"] = False
        save(p, d)
    p, d = load(".obsidian/plugins/omnisearch/data.json")
    if d is not None:
        d.pop("welcomeMessage", None); d["httpApiEnabled"] = False; d["DANGER_httpHost"] = None; save(p, d)
    p, d = load(".obsidian/plugins/quickadd/data.json")
    if d is not None:
        for prov in (d.get("ai", {}) or {}).get("providers", []) or []:
            if isinstance(prov, dict): prov["apiKey"] = ""
        d["disableOnlineFeatures"] = True; save(p, d)
    p, d = load(".obsidian/core-plugins.json")
    if d is not None: d["sync"] = False; save(p, d)
    p, d = load(".obsidian/app.json")
    if d is not None: d["newFileLocation"] = "current"; d.pop("newFileFolderPath", None); save(p, d)
    workspace = {"main": {"id": "main", "type": "split", "children": [{"id": "leaf", "type": "tabs", "children": [{"id": "setup", "type": "leaf", "state": {"type": "markdown", "state": {"file": "00 仪表盘/设置向导.md", "mode": "preview"}}}]}], "direction": "vertical"},
                 "active": "setup", "lastOpenFiles": ["00 仪表盘/设置向导.md"]}
    save(os.path.join(out, ".obsidian/workspace.json"), workspace)

def text_surgery(out, without_reading):
    readme = Path(out, "README.md")
    body = readme.read_text(encoding="utf-8")
    body = body.replace("检查结果见开发分支的 `specs/001-simplified-chinese-vault/acceptance.md`。", "")
    body = re.sub(r"(?m)^根目录还包括 .*?\n", "根目录保留 `AGENTS.md`、`CLAUDE.md`、`GEMINI.md`、`.claude/settings.json`、`.claude-obsidian.json`、`.mcp.example.json`、`CREDITS.md` 与许可说明；它们分别用于智能体规则、知识层接入和来源说明。\n", body, count=1)
    body = re.sub(r"(?ms)^## 构建与发布\n.*?(?=^## 致谢与许可)", "## 备份与更新\n\n更新前先备份完整仓库，在旁边解压新版，再逐项审查并迁移个人笔记与配置。不要直接覆盖正在使用的 `.obsidian`。\n\n", body, count=1)
    body = re.sub(r"社区规则见 `CODE_OF_CONDUCT.md`；参与方式见 `CONTRIBUTING.md`；安全说明见 `SECURITY.md`。", "", body)
    body = body.replace("scripts/         阅读计划生成、经文拆分、模板构建与验证", "scripts/         阅读计划生成与经文拆分")
    body = body.replace(".github/         CI 验证流程及议题模板\n", "")
    readme.write_text(body, encoding="utf-8")
    if without_reading:
        for rel in READING_PATHS:
            p = os.path.join(out, rel)
            if os.path.isdir(p): shutil.rmtree(p)
            elif os.path.exists(p): os.remove(p)
        p = os.path.join(out, "模板/每日笔记.md")
        s = Path(p).read_text(encoding="utf-8")
        s = re.sub(r"> \[!reading\]- 每日阅读\n(?:> .*\n)+\n", "", s)
        s = s.replace("path does not include 09 阅读/阅读计划\n", "")
        Path(p).write_text(s, encoding="utf-8")
        def edit(rel, fn):
            q = os.path.join(out, rel)
            if os.path.exists(q):
                t = Path(q).read_text(encoding="utf-8")
                Path(q).write_text(fn(t), encoding="utf-8")
        def remove_setup_reading(t):
            sentence = "决定是否使用阅读模块：填写 [[阅读计划]]，或删除 `09 阅读`。"
            if t.count(sentence) != 1:
                raise ValueError("Cannot safely remove reading setup guidance")
            return t.replace(sentence, "")
        edit("00 仪表盘/设置向导.md", remove_setup_reading)
        edit("指南/00 从这里开始.md", lambda t: re.sub(r"^\| 5 \| 每日阅读.*\n", "", t, flags=re.M))
        edit("AGENTS.md", lambda t: re.sub(r"^\| `09 阅读/`.*\n", "", t, flags=re.M))
        edit("README.md", lambda t: re.sub(r"^09 阅读/.*\n", "", t, flags=re.M))
        edit("README.md", lambda t: re.sub(r"^\| 5 \| 每日阅读.*\n", "", t, flags=re.M))
        edit("00 仪表盘/任务仪表盘.md", lambda t: t.replace("path does not include 09 阅读/阅读计划\n", ""))
        edit("指南/02 插件.md", lambda t: t.replace("共有 20 个选项", "共有 19 个选项").replace("8 个按模板新建", "7 个按模板新建").replace("其余 12 个是模板选项", "其余 11 个是模板选项").replace("| 📖 新建研读笔记 | `09 阅读/研读笔记/{{VALUE}}.md` | `模板/研读笔记.md` |\n", ""))
        edit("指南/21 Life OS 应用.md", lambda t: t.replace("`07 资料库/` 与 `09 阅读/`", "`07 资料库/`").replace("、读书与研读笔记", "与读书笔记"))
        life_os = Path(out, ".obsidian/plugins/life-os-app/main.js")
        source = life_os.read_text(encoding="utf-8")
        study_action = r'(?m)^\s*\{\n\s*icon: "book-open-check",\n\s*label: "新建研读笔记",\n\s*description: "[^"]+",\n\s*command: "quickadd:choice:lifeos-new-study-note",\n\s*\},\n'
        reading_action = r'(?m)^\s*\{\n\s*icon: "book-open",\n\s*label: "阅读计划",\n\s*description: "[^"]+",\n\s*path: "09 阅读/阅读计划.md",\n\s*\},\n'
        source, removed_study = re.subn(study_action, "", source)
        source, removed_plan = re.subn(reading_action, "", source)
        if (removed_study, removed_plan) != (2, 1):
            raise ValueError("Cannot safely remove reading actions from Life OS")
        life_os.write_text(source, encoding="utf-8")
        quickadd = Path(out, ".obsidian/plugins/quickadd/data.json")
        choices = json.loads(quickadd.read_text(encoding="utf-8"))
        choices["choices"] = [choice for choice in choices["choices"] if choice.get("id") != "lifeos-new-study-note"]
        quickadd.write_text(json.dumps(choices, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        tj = os.path.join(out, ".obsidian/plugins/templater-obsidian/data.json")
        if os.path.exists(tj):
            with open(tj, encoding="utf-8") as stream:
                d = json.load(stream)
            d["folder_templates"] = [x for x in d.get("folder_templates", []) if not x.get("folder", "").startswith("09 阅读")]
            with open(tj, "w", encoding="utf-8") as stream:
                json.dump(d, stream, indent=2, ensure_ascii=False)
                stream.write("\n")

def version_stamp(out, version):
    plugins = {}
    pdir = os.path.join(out, ".obsidian/plugins")
    for d in sorted(os.listdir(pdir)):
        m = os.path.join(pdir, d, "manifest.json")
        if os.path.exists(m):
            with open(m, encoding="utf-8") as stream:
                plugins[d] = json.load(stream)["version"]
    Path(out, "元数据/version.md").write_text(
        "---\ntemplate_version: %s\nbuilt: %s\nrelease_status: candidate\nmin_obsidian: 1.13.1\nplugins:\n%s---\n# 版本\n\n这是本机候选，不能据此认定已完成 Obsidian 原生验收或公开发布。仓库没有原位升级器。请先备份旧仓库，再把个人内容与自定义配置逐项审查后迁入旁边的新副本。\n"
        % (version, datetime.date.today().isoformat(), "".join('  %s: "%s"\n' % kv for kv in plugins.items())), encoding="utf-8")

def chmod_all(out):
    for root, dirs, files in os.walk(out):
        for d in dirs: os.chmod(os.path.join(root, d), 0o755)
        for f in files: os.chmod(os.path.join(root, f), 0o755 if f.endswith(".py") else 0o644)

def manifest(out):
    lines = []
    for root, _, files in os.walk(out):
        for f in sorted(files):
            if f == "MANIFEST.sha256": continue
            p = os.path.join(root, f)
            h = hashlib.sha256(Path(p).read_bytes()).hexdigest()
            lines.append("%s  %s" % (h, os.path.relpath(p, out).replace("\\", "/")))
    Path(out, "MANIFEST.sha256").write_text("\n".join(sorted(lines)) + "\n", encoding="utf-8")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", default=LIVE)
    ap.add_argument("--out", default=os.path.join(os.path.dirname(LIVE), "life-os-releases"))
    ap.add_argument("--name", default="Compass")
    ap.add_argument("--version", required=True)
    ap.add_argument("--zip", action="store_true")
    ap.add_argument("--without-reading", action="store_true")
    a = ap.parse_args()
    version = a.version
    if not re.fullmatch(r"\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?", version):
        raise ValueError("Version must be an explicit semantic version")
    live, parent, destination = validate_destination(a.live, a.out, a.name)
    archive = parent / ("%s-template-v%s%s.zip" % (a.name, version, "-without-reading" if a.without_reading else ""))
    checksum = Path(str(archive) + ".sha256")
    if a.zip and (os.path.lexists(archive) or os.path.lexists(checksum)):
        raise ValueError("Archive or checksum already exists; refusing overwrite")
    parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".life-os-stage-", dir=parent) as staging:
        out = os.path.join(staging, a.name)
        os.mkdir(out, 0o700)
        copy_tree(str(live), out)
        reset_defaults(out)
        json_surgery(out)
        text_surgery(out, a.without_reading)
        version_stamp(out, version)
        os.makedirs(os.path.join(out, "inbox"), exist_ok=True); open(os.path.join(out, "inbox/.gitkeep"), "a").close()
        os.makedirs(os.path.join(out, "元数据/附件"), exist_ok=True)
        open(os.path.join(out, "元数据/附件/.gitkeep"), "a").close()
        chmod_all(out)
        manifest(out)
        rc = subprocess.call([sys.executable, os.path.join(HERE, "verify_template.py"), out])
        if rc != 0:
            print("Verification failed; private staging removed; no archive published")
            return rc
        # Reserve the name without pre-creating the destination: Windows cannot
        # replace even an empty destination directory.
        reservation = parent / f".{a.name}.reservation"
        descriptor = os.open(reservation, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        os.close(descriptor)
        try:
            if destination.exists() or destination.is_symlink():
                raise ValueError("Destination already exists; choose a fresh output name")
            os.replace(out, destination)
        finally:
            reservation.unlink()
        print("Verified local candidate", destination)
        if a.zip:
            temporary_zip = os.path.join(staging, "candidate.zip")
            with zipfile.ZipFile(temporary_zip, "w", zipfile.ZIP_DEFLATED) as z:
                for root, dirs, files in os.walk(destination):
                    dirs.sort()
                    for f in sorted(files):
                        p = os.path.join(root, f); z.write(p, os.path.join(a.name, os.path.relpath(p, destination)))
            with zipfile.ZipFile(temporary_zip) as z:
                if z.testzip() is not None: raise ValueError("Archive integrity failed")
            digest = hashlib.sha256(Path(temporary_zip).read_bytes()).hexdigest()
            temporary_sum = os.path.join(staging, "candidate.sha256")
            Path(temporary_sum).write_text(digest + "  " + archive.name + "\n")
            # Same-filesystem exclusive hard links publish complete files, never partial ZIPs.
            os.link(temporary_zip, archive)
            os.link(temporary_sum, checksum)
            print("Local archive and full SHA256 written; native acceptance still required")
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, OSError) as exc:
        print(f"构建已安全停止：{exc}", file=sys.stderr)
        sys.exit(1)
