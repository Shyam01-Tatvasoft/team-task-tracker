# React Learning Notes – Team Task Tracker

## Phase 1: React Fundamentals

### Step 1: Project Setup (Vite + React 19)

**What:** Vite is a dev server and build tool. `main.jsx` is the entry point that mounts React into `<div id="root">`.

**How it works:**
1. Browser loads `index.html`, which has `<div id="root">` and a `<script type="module" src="/src/main.jsx">`.
2. `createRoot(...).render(<App />)` tells React to take over that div.
3. `App` returns JSX, which React turns into DOM nodes.

**Implemented:** Clean Vite project, folder structure by responsibility (components, pages, hooks, context, services, utils, data).

**Use when:** Starting any modern SPA.
**Avoid:** Create React App (deprecated).

**Common mistakes:**
- Putting everything in `App.jsx`.
- Installing libraries before they're needed.
- Forgetting `.jsx` extension on files containing JSX (Vite requires it).

**Interview Q&A:**
1. *Why Vite over CRA?* Native ESM dev server (no full bundle on start) and Rollup-based production builds. It's much faster, and CRA is no longer maintained.
2. *What does StrictMode do?* In development only, it double-invokes renders and effects (mount → unmount → mount) to expose impure renders and missing cleanups. It has no effect in production.
3. *What does `createRoot` do vs the old `ReactDOM.render`?* `createRoot` enables React 18+ concurrent features (automatic batching, transitions). `ReactDOM.render` was removed in React 19.

### Step 2: JSX, Components and Props

**What:** JSX is syntax sugar for `React.createElement`-style calls (compiled by the build tool). A component is a capitalized function returning JSX. Props are read-only inputs from parent to child.

**How it works:** When React renders `<Header title="X" />`, it calls `Header({ title: "X" })` and uses the returned JSX to update the DOM. Data flows one way: parent → child.

**Implemented:** `Header` (title, userName) and `Sidebar` (appName) composed in `App`.

**Use when:** Splitting UI into pieces that have a single responsibility.
**Avoid:** Giant components, or components that copy props into other variables and mutate them.

**Common mistakes:**
- `class` instead of `className`.
- Lowercase component names (treated as HTML tags).
- Mutating props.
- Returning multiple roots without a wrapper or Fragment.
- Statements inside `{}`.

**Interview Q&A:**
1. *What is JSX and does the browser understand it?* It's JavaScript syntax that looks like HTML. The browser doesn't understand it, so Vite compiles it into plain JS function calls (the JSX runtime) before it runs.
2. *Why must component names be capitalized?* JSX treats lowercase tags as DOM elements (`<div>`) and capitalized ones as component references (`<Header>`).
3. *Why are props read-only?* React relies on pure rendering: the same props should give the same output. Mutating props causes unpredictable UI and breaks optimizations. To change data, the owner updates state (Phase 2).

### Step 3: children and Composition

**What:** `children` is a special prop containing whatever is nested between a component's tags. Composition means building UI by nesting components instead of adding more and more props.

**How it works:** The parent creates the nested elements and passes them as `props.children`. The receiving component decides where to render them with `{children}`.

**Implemented:** `Layout` (sidebar + header + `{children}` in main) and `Card` (title + `{children}` body). `App` composes them.

**Use when:** Wrappers, containers, layouts, cards, modals, anything whose content varies.
**Avoid:** Many config props (`showFooter`, `footerText`...) when nesting would be simpler.

**Common mistakes:**
- Forgetting to render `{children}` (content silently disappears).
- Calling `children.map` (children may be a single element or undefined).
- Putting page-specific logic inside a generic wrapper.

**Interview Q&A:**
1. *What is `props.children`?* A special prop holding the JSX nested between a component's opening and closing tags. It enables wrapper/container components.
2. *Composition vs inheritance in React?* React uses composition: pass components or JSX as children or props. It's more flexible than inheritance and avoids tight coupling.
3. *Is `children` always an array?* No. It can be undefined, a single element, a string, or an array, so don't assume the shape. Use `React.Children` helpers if you must manipulate it.

### Step 4: Lists, Keys and Fragments

**What:** `array.map()` turns data into JSX elements. A `key` is a stable unique id that lets React track list items between renders. A Fragment groups siblings without adding a DOM node.

**How it works:** On re-render React compares old and new children using keys. Matching keys reuse the existing component and DOM; new keys mount; missing keys unmount. `key` is not passed as a prop.

**Implemented:** `employees.js` sample data, `EmployeeList` (maps to `EmployeeCard`, returns a `<>` fragment) and `EmployeeCard` (keyed `Fragment` for `dt`/`dd` pairs).

**Use when:** Rendering any collection. Use Fragments when a wrapper element would break layout or semantics.
**Avoid:** Index keys on dynamic lists, random keys, redundant wrapper divs.

**Common mistakes:**
- Missing or duplicate keys.
- `key={index}` on lists that are sorted, filtered or edited.
- `Math.random()` as key (remounts every render).
- Putting the key on an inner element instead of the one returned by `map`.
- Using `<>` when a key is needed.

**Interview Q&A:**
1. *Why does React need keys?* Keys identify items across renders so React can reuse, move or remove the right DOM nodes and preserve component state. Without them, it matches by position, which causes wasted work and state bugs.
2. *Why is index a bad key for dynamic lists?* When items are inserted, removed or reordered, indexes shift. React then associates old state and DOM with the wrong item, causing bugs like inputs showing the wrong value.
3. *When do you use `<Fragment>` instead of `<>`?* When you need to give it a `key`, such as when mapping to multiple sibling elements. The short syntax doesn't support attributes.

### Step 5: Conditional Rendering

**What:** Rendering different UI based on props or state using plain JavaScript: early returns, ternaries, `&&`, and `||`/`??` fallbacks.

**How it works:** JSX is just expressions. React renders `false`, `null`, `undefined` and `true` as nothing. Numbers (including `0`) and strings render as text.

**Implemented:** `Badge`, `EmptyState`, an "On leave" badge (`&&`), a missing-email fallback (`||`), singular/plural count (ternary), and `isLoading` / empty early returns in `EmployeeList`.

**Use when:** Loading, error, empty and permission-based UI; optional elements.
**Avoid:** Nested ternaries, `&&` with non-boolean numbers, early returns before hooks.

**Common mistakes:**
- `{list.length && <X />}` rendering `0`.
- `||` when `0` or `''` is a valid value (use `??`).
- Early return before a hook call (breaks the Rules of Hooks).
- Assuming hidden (CSS) and unmounted (conditional) behave the same: unmounting loses state.

**Interview Q&A:**
1. *Why does `{count && <X />}` show `0`?* `&&` returns the left operand when it's falsy, and React renders the number `0` as text. Use `count > 0 && <X />` or a ternary.
2. *Difference between `||` and `??`?* `||` falls back on any falsy value (`0`, `''`, `false`). `??` falls back only on `null`/`undefined`, so it preserves `0` and empty strings.
3. *What happens to component state when it's conditionally removed?* It unmounts and its state is destroyed. When it is rendered again, it mounts fresh with initial state. CSS hiding keeps it mounted and preserves state.

### Step 6: Events and Component Communication

**What:** Events are handled via camelCase props (`onClick`, `onChange`) that receive a function. To communicate child → parent, the parent passes a callback prop and the child calls it with data.

**How it works:** React wraps native events in a SyntheticEvent and calls your handler. Props flow down; callbacks carry data up. The parent owns the logic, the child just reports what happened.

**Implemented:** `Button`, `SearchInput`, "View profile" button on `EmployeeCard`, and `handleViewProfile` / `handleSearchChange` in `App` (logged to console for now).

**Use when:** Any user interaction; child needs to notify the parent.
**Avoid:** Calling handlers during render, deep callback chains (prop drilling), unnecessary `stopPropagation`.

**Common mistakes:**
- `onClick={fn()}` instead of `onClick={fn}` or `() => fn(arg)`.
- Forgetting the arrow wrapper when passing arguments.
- Missing `type="button"` on buttons inside forms.
- Expecting UI to change without state.

**Interview Q&A:**
1. *What is a SyntheticEvent?* React's cross-browser wrapper around native events with the same interface (`target`, `preventDefault`, etc.). Since React 17 events are not pooled.
2. *How does a child send data to its parent?* The parent passes a function via props; the child calls it with the data as arguments.
3. *Why `onClick={() => fn(id)}` instead of `onClick={fn(id)}`?* The latter calls `fn` during render and passes its return value as the handler. The arrow function defers the call until the click.

## Phase 2: State Management

### Step 1: useState Basics

**What:** `useState` lets a component remember data between renders. Calling the setter schedules a re-render with the new value.

**How it works:** `const [value, setValue] = useState(initial)`. The initial value is used on the first render only. Each render sees state as a snapshot. `setValue` does not change the current variable; the next render gets the new value. React keeps the state per component instance, tracked by hook call order.

**Implemented:** `searchText` (filters employees) and `selectedEmployeeId` (drives "Selected Employee" card) in `App`. Moved `SearchInput` out of `EmployeeList` so it isn't unmounted by the empty state.

**Use when:** Data changes over time and the UI must react to it.
**Avoid:** State for values you can compute from other state or props, mutating variables directly, hooks inside conditions or loops.

**Common mistakes:**
- Assigning to the variable instead of calling the setter.
- Expecting the new value right after calling the setter (snapshot).
- Storing a whole object when an id is enough (can go stale).
- Calling hooks conditionally.
- Unmounting an input by returning early from its parent.

**Interview Q&A:**
1. *Why doesn't `setCount(count + 1); console.log(count)` show the new value?* State is a snapshot for the current render. The setter schedules a re-render, and the new value only appears in the next render's call to `useState`.
2. *What happens if you call the setter with the same value?* React bails out using `Object.is` comparison and skips re-rendering the children (it may still call the component once more before bailing).
3. *Why can't hooks be called conditionally?* React identifies each hook by its call order within a component. A conditional call changes the order between renders, so state gets matched to the wrong hook.

### Step 2: State Immutability (Objects and Arrays)

**What:** Never mutate state. Always set a new object or array so React sees a new reference.

**How it works:** React compares old and new state with `Object.is`. Mutating in place keeps the same reference, so React skips the re-render. Spread (`...`), `map`, `filter` and `slice` return new copies; `push`, `splice`, `sort`, `reverse` and direct assignment mutate.

**Implemented:** `employees` is now state in `App`. Toggle on leave (`map` + `{ ...e, onLeave: !e.onLeave }`), remove (`filter`), add sample hire (`[...employees, hire]`).

**Use when:** Any state that is an object or array.
**Avoid:** Mutating methods on state, assuming spread is a deep copy.

**Common mistakes:**
- `push` / assignment then `setState(sameReference)`: no re-render.
- `setState(arr.sort())`: `sort` mutates and returns the same array.
- Shallow spread for nested updates (inner objects are still shared).
- Copying with `const copy = arr` (copies reference only).
- Mutation that "works" only because another update triggers a render.

**Interview Q&A:**
1. *Why must React state be immutable?* React detects changes by reference comparison. In-place mutation keeps the reference, so React can't tell anything changed and skips rendering. Immutability also makes memoization and effect dependencies reliable.
2. *How do you update one item inside an array in state?* Use `map`: return `{ ...item, field: newValue }` for the matching id and the original item for the others. `setItems(items.map(...))`.
3. *Is the spread operator a deep copy?* No, it is shallow: it copies top-level properties and shares nested objects. For nested updates, spread each level you change (or use a library like Immer).

### Step 3: Functional Updates and Batching

**What:** `setState(prev => next)` computes the next state from the latest queued value. Batching groups all `setState` calls from one handler into a single re-render.

**How it works:** React queues updates during an event handler, then processes them in order, passing each updater the result of the previous one. A direct value (`setX(x + 1)`) uses the render's snapshot, so repeated calls overwrite each other. Since React 18, batching also applies in promises, timeouts and native events.

**Implemented:** Handlers converted to `prev =>` form, "Add all hires" (multiple updates in one handler), "Mark all available" (bulk update), and a pure `addHire` helper.

**Use when:** The new state depends on the old state, or one handler/async callback performs several updates.
**Avoid:** Side effects or mutation inside updaters, mixing direct and functional styles in one handler.

**Common mistakes:**
- Several `setX(x + 1)` calls expecting an accumulated result.
- Looping `setItems([...items, item])` (only the last item survives).
- Side effects in updater functions (StrictMode runs them twice).
- Expecting one render per `setState` call.
- Reading state immediately after calling the setter.

**Interview Q&A:**
1. *When do you need a functional update?* When the next state depends on the previous state, especially for multiple updates in one handler or inside async callbacks and timers. `setCount(c => c + 1)` always uses the latest queued value.
2. *What is automatic batching?* React groups multiple state updates into one re-render. Since React 18 this works everywhere (event handlers, promises, timeouts, native events), not only inside React event handlers.
3. *Why must updater functions be pure?* React may call them more than once (StrictMode does so in development) and relies on the same input giving the same output. Side effects or mutation inside them cause bugs and duplicate work.

### Step 6: Controlled Components and Sorting

- **Controlled input:** `value={state}` + `onChange={e => setState(e.target.value)}`. React owns the value, so you can reset or transform it. Uncontrolled inputs keep their value in the DOM.
- **Sorting:** derive it during render and sort a copy (`[...list].sort`), since `sort` mutates.
- Order of derivation: filter, then sort, then paginate.

### Phase 2 Interview Q&A
1. Why can't `setCount(count + 1)` three times add 3? Each call uses the same snapshot; use `setCount(c => c + 1)`.
2. Why must state be immutable? React detects changes by reference, so in-place mutation looks like no change.
3. Where should shared state live? In the closest common parent; pass data down, callbacks up.
4. What is derived state? Anything computable from state or props. Compute it in render and don't store it.
5. Controlled vs uncontrolled input? Controlled: state drives the value. Uncontrolled: the DOM holds it, read via ref or on submit.
6. Why does `[...arr].sort()` and not `arr.sort()`? `sort` mutates the array in place and returns the same reference.