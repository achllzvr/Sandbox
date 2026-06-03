/**
 * Scroll a shell-map node into view, centered in the scroll container when possible.
 * Clamps to top (0) or bottom (max scroll) when centering would overshoot.
 */
export default function scrollNodeIntoShellView(container, node, { behavior = 'smooth' } = {}) {
    if (!container || !node) {
        return;
    }

    const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
    const containerRect = container.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();

    const nodeCenter = container.scrollTop + (nodeRect.top - containerRect.top) + nodeRect.height / 2;
    let target = nodeCenter - container.clientHeight / 2;

    target = Math.max(0, Math.min(target, maxScroll));

    container.scrollTo({ top: target, behavior });
}
