---
id: versioning
title: Versioning
slug: /versioning
---

You can use the version script to create a new documentation version based on the latest content in the `docs` directory. That specific set of documentation will then be preserved and accessible even as the documentation in the `docs` directory changes moving forward.

:::caution

Think about it before starting to version your documentation - it can become difficult for contributors to help improve it!

:::

Most of the time, you don't need versioning as it will just increase your build time, and introduce complexity to your codebase. Versioning is **best suited for websites with high-traffic and rapid changes to documentation between versions**. If your documentation rarely changes, don't add versioning to your documentation.

To better understand how versioning works and see if it suits your needs, you can read on below.

## Directory structure {#directory-structure}

```bash
website
├── sidebars.json        # sidebar for the current docs version
├── docs                 # docs directory for the current docs version
│   ├── foo
│   │   └── bar.md       # https://mysite.com/docs/next/foo/bar
│   └── hello.md         # https://mysite.com/docs/next/hello
├── versions.json        # file to indicate what versions are available
├── versioned_docs
│   ├── version-1.1.0
│   │   ├── foo
│   │   │   └── bar.md   # https://mysite.com/docs/foo/bar
│   │   └── hello.md
│   └── version-1.0.0
│       ├── foo
│       │   └── bar.md   # https://mysite.com/docs/1.0.0/foo/bar
│       └── hello.md
├── versioned_sidebars
│   ├── version-1.1.0-sidebars.json
│   └── version-1.0.0-sidebars.json
├── docusaurus.config.js
└── package.json
```

The table below explains how a versioned file maps to its version and the generated URL.

| Path                                    | Version        | URL               |
| --------------------------------------- | -------------- | ----------------- |
| `versioned_docs/version-1.0.0/hello.md` | 1.0.0          | /docs/1.0.0/hello |
| `versioned_docs/version-1.1.0/hello.md` | 1.1.0 (latest) | /docs/hello       |
| `docs/hello.md`                         | current        | /docs/next/hello  |

:::tip

The files in the `docs` directory belong to the `current` docs version.

By default, the `current` docs version is labeled as `Next` and hosted under `/docs/next/*`, but it is entirely configurable to fit your project's release lifecycle.

:::

### Tagging a new version {#tagging-a-new-version}

1. First, make sure the current docs version (the `docs` directory) is ready to be frozen.
1. Enter a new version number.

```bash npm2yarn
npm run docusaurus docs:version 1.1.0
```

When tagging a new version, the document versioning mechanism will:

- Copy the full `docs/` folder contents into a new `versioned_docs/version-[versionName]/` folder.
- Create a versioned sidebars file based from your current [sidebar](docs-introduction.md#sidebar) configuration (if it exists) - saved as `versioned_sidebars/version-[versionName]-sidebars.json`.
- Append the new version number to `versions.json`.

## Docs {#docs}

### Creating new docs {#creating-new-docs}

1. Place the new file into the corresponding version folder.
2. Include the reference to the new file in the corresponding sidebar file according to the version number.

**Current version docs**

```bash
# The new file.
docs/new.md

# Edit the corresponding sidebar file.
sidebar.js
```

**Older version docs**

```bash
# The new file.
versioned_docs/version-1.0.0/new.md

# Edit the corresponding sidebar file.
versioned_sidebars/version-1.0.0-sidebars.json
```

### Linking docs {#linking-docs}

- Remember to include the `.md` extension.
- Files will be linked to the correct corresponding version.
- Relative paths work as well.

```md
The [@hello](hello.md#paginate) document is great!

See the [Tutorial](../getting-started/tutorial.md) for more info.
```

## Versions {#versions}

Each directory in `versioned_docs/` will represent a documentation version.

### Updating an existing version {#updating-an-existing-version}

You can update multiple docs versions at the same time because each directory in `versioned_docs/` represents specific routes when published.

1. Edit any file.
1. Commit and push changes.
1. It will be published to the version.

Example: When you change any file in `versioned_docs/version-2.6/`, it will only affect the docs for version `2.6`.

### Deleting an existing version {#deleting-an-existing-version}

You can delete/remove versions as well.

1. Remove the version from `versions.json`.

Example:

```diff
[
  "2.0.0",
  "1.9.0",
  // highlight-next-line
- "1.8.0"
]
```

2. Delete the versioned docs directory. Example: `versioned_docs/version-1.8.0`.
3. Delete the versioned sidebars file. Example: `versioned_sidebars/version-1.8.0-sidebars.json`.

## Recommended practices {#recommended-practices}

### Figure out the behavior for the "current" version {#figure-out-the-behavior-for-the-current-version}

The "current" version is the version name for the `./docs` folder.

There are different ways to manage versioning, but two very common patterns are:

- You release v1, and start immediately working on v2 (including its docs)
- You release v1, and will maintain it for some time before thinking about v2.

Docusaurus defaults work great for the first use case.

**For the 2nd use case**: if you release v1 and don't plan to work on v2 anytime soon, instead of versioning v1 and having to maintain the docs in 2 folders (`./docs` + `./versioned_docs/version-1.0.0`), you may consider using the following configuration instead:

```json
{
  "lastVersion": "current",
  "versions": {
    "current": {
      "label": "1.0.0",
      "path": "1.0.0"
    }
  }
}
```

The docs in `./docs` will be served at `/docs/1.0.0` instead of `/docs/next`, and `1.0.0` will become the default version we link to in the navbar dropdown, and you will only need to maintain a single `./docs` folder.

See [docs plugin configuration](../../api/plugins/plugin-content-docs.md) for more details.

### Version your documentation only when needed {#version-your-documentation-only-when-needed}

For example, you are building documentation for your npm package `foo` and you are currently in version 1.0.0. You then release a patch version for a minor bug fix and it's now 1.0.1.

Should you cut a new documentation version 1.0.1? **You probably shouldn't**. 1.0.1 and 1.0.0 docs shouldn't differ according to semver because there are no new features!. Cutting a new version for it will only just create unnecessary duplicated files.

### Keep the number of versions small {#keep-the-number-of-versions-small}

As a good rule of thumb, try to keep the number of your versions below 10. You will **very likely** to have a lot of obsolete versioned documentation that nobody even reads anymore. For example, [Jest](https://jestjs.io/versions) is currently in version `27.4`, and only maintains several latest documentation versions with the lowest being `25.X`. Keep it small 😊

:::tip archive older versions

If you deploy your site on a Jamstack provider (e.g. [Netlify](../../deployment.mdx)), the provider will save each production build as a snapshot under an immutable URL. You can include archived versions that will never be rebuilt as external links to these immutable URLs. The Jest website and the Docusaurus website both use such pattern to keep the number of actively built versions low.

:::

### Use absolute import within the docs {#use-absolute-import-within-the-docs}

Don't use relative paths import within the docs. Because when we cut a version the paths no longer work (the nesting level is different, among other reasons). You can utilize the `@site` alias provided by Docusaurus that points to the `website` directory. Example:

```diff
- import Foo from '../src/components/Foo';
+ import Foo from '@site/src/components/Foo';
```

### Global or versioned colocated assets {#global-or-versioned-colocated-assets}

You should decide if assets like images and files are per-version or shared between versions.

If your assets should be versioned, put them in the docs version, and use relative paths:

```md
![img alt](./myImage.png)

[download this file](./file.pdf)
```

If your assets are global, put them in `/static` and use absolute paths:

```md
![img alt](/myImage.png)

[download this file](/file.pdf)
```
