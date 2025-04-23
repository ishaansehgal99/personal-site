import os
import shutil
import frontmatter

SOURCE_VAULT = "/Users/ishaansehgal/Documents/Ishaan's Vault"
DEST_FOLDER = "/Users/ishaansehgal/Documents/quartz/content"
EXCLUDED_FOLDERS = {"templates", ".obsidian"}

def is_publishable(filepath):
    try:
        post = frontmatter.load(filepath)
        return post.get("publish", False) is True
    except Exception as e:
        print(f"⚠️ Skipped {filepath} due to error: {e}")
        return False

def collect_md_files(base):
    for root, dirs, files in os.walk(base):
        # Skip excluded folders
        dirs[:] = [d for d in dirs if d.lower() not in EXCLUDED_FOLDERS]
        for file in files:
            if file.endswith(".md"):
                yield os.path.join(root, file)
            elif file.endswith(".png") and root in ["/Users/ishaansehgal/Documents/Ishaan's Vault/wtfhappendin1971",
                                                    "/Users/ishaansehgal/Documents/Ishaan's Vault/Tech Learnings/Databases"]:
                yield os.path.join(root, file)

def relative_path(base, full_path):
    return os.path.relpath(full_path, base)

def main():
    # Clean out the destination folder
    if os.path.exists(DEST_FOLDER):
        shutil.rmtree(DEST_FOLDER)
    os.makedirs(DEST_FOLDER, exist_ok=True)

    # Copy over publishable files
    for filepath in collect_md_files(SOURCE_VAULT):
        if filepath.endswith(".png") or is_publishable(filepath):
            rel_path = relative_path(SOURCE_VAULT, filepath)
            dest_path = os.path.join(DEST_FOLDER, rel_path)

            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.copy2(filepath, dest_path)
            print(f"✅ Copied: {rel_path}")

    print("🎉 Export complete.")

if __name__ == "__main__":
    main()
