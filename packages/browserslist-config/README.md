# @pandell/browserslist-config

This configuration reflects Pandell's browser policy for web applications.

## What is Browserslist?

Share browsers list between different front-end tools, like Autoprefixer, Stylelint and babel-preset-env.

- [Browserslist](https://github.com/browserslist/browserslist) (Github repo)
- ["Browserslist is a Good Idea"](https://css-tricks.com/browserlist-good-idea/) (blog post by [@chriscoyier](https://github.com/chriscoyier))

## Usage

Add the following to your `package.json`:

```json
{
  "browserslist": ["extends @pandell/browserslist-config"]
}
```

## Browser Support

See [browserslist.dev](https://browserslist.dev/?q=ZGVmYXVsdHMgYW5kID4gMSUsIG5vdCBpZSAxMSwgbm90IG9wX21pbmkgYWxs) for the latest browsers covered by our syntax.

We use the following browserslist query:

```text
defaults and > 1%, not ie 11, not op_mini all
```
