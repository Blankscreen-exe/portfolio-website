export const toggleTheme = (state, payload) => {
    // Older persisted state may hold the object `{ isDarkMode: false }` (truthy), so only a
    // literal `true` counts as dark.
    return state !== true
}