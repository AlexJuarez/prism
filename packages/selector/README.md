# @Prism/selector

This is a light weight chainable selector for navigating ast trees.

## How to use

```javascript
const prism = require('@prism/selector');

// get your ast or obj

const root = prism(ast);

root.find('identifier', { name: 'test' }).forEach(path => {
  const { name } = path.node;

  path.node.name = Array.from(name).reverse().join('');
});
```

### prism chain methods

| method | arguments | modifies selection | description |
| --- | --- | --- | --- |
| find | `(type: string | function, selectors: any): chain` | yes | select nodes that are children of the given nodes based on selectors |
| forEach | `(fn: function): chain` | no | for each node in the selection do the given function |
| replaceWith | `(fn: function): chain` | no | replace each node in the selection with the function |
| remove | `(): chain` | no | remove the selected nodes |
| filter | `(fn: function): chain` | yes | filter the selected nodes |
| size | `(): number` | no | return the number of selected nodes |
| closest | `(type: string | function, selectors: any): chain` | yes | selects the closest direct parents of the given node that match the selectors |
| nodes | `(): Array<Nodes>` | no | returns the selected nodes |
| map | `(fn: function): chain` | yes | map the function given across the selected nodes |

### selector behaviors

| type | behavior |
| --- | --- |
| `function` | `fn(node) === true`? |
| `array` | Do any of the objects in the selection array match objects in the object array |
| `object` | Does selection\[key\] match the object\[key\] |
| `number | string | any` | does the selection match the given value |
