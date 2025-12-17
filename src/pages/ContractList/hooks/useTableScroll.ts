export const useTableScroll = (scrollContainerSelector: string = '.ant-table-body') => {

    const scrollToSection = (sectionKey: string) => {
        // 1. Find the anchor element (Header Cell)
        // Note: We specifically look for the TH to ensure we get the header position
        const targetClass = `col-anchor-${sectionKey}`;
        const targetEl = document.querySelector(`th.${targetClass}`) as HTMLElement ||
            document.querySelector(`.${targetClass}`) as HTMLElement;

        if (!targetEl) {
            console.warn(`[useTableScroll] Target element .${targetClass} not found`);
            return;
        }

        // 2. Find the scroll container
        // Ant Design Table structure usually has .ant-table-body (for vertical scroll) or .ant-table-content (for horizontal)
        // We look for the one that actually has overflow-x
        const tableWrapper = targetEl.closest('.ant-table-wrapper');
        const scrollContainer = tableWrapper?.querySelector('.ant-table-body') as HTMLElement ||
            tableWrapper?.querySelector('.ant-table-content') as HTMLElement ||
            document.querySelector(scrollContainerSelector) as HTMLElement;

        if (!scrollContainer) {
            console.warn('[useTableScroll] Scroll container not found');
            return;
        }

        // 3. Dynamic Fixed Column Calculation
        // Find all fixed-left header cells in the same table and sum their widths
        // OR find the specific "last fixed left" cell.
        let fixedOffset = 0;

        // Strategy: Get the "sticky" left position of the target element? No, target is NOT sticky usually.
        // We need to know how much "sticky" content covers the left side.
        // Find all sticky left THs in the thead
        const thead = targetEl.closest('thead');
        if (thead) {
            const fixedCells = Array.from(thead.querySelectorAll('.ant-table-cell-fix-left')) as HTMLElement[];
            if (fixedCells.length > 0) {
                // The widely compatible way involves getting the rightmost edge of the fixed columns
                // But simply: sticky columns usually have 'left: ...px' set.
                // The last fixed column's 'left' + its 'offsetWidth' = total fixed width.
                // Let's find the one with the largest 'left' value + width.

                let maxRight = 0;
                fixedCells.forEach(cell => {
                    // Note: cell.style.left might be empty if handled by class (rare in antd dynamic)
                    // Inspecting computed style is safer but slow.
                    // AntD sets style="left: Xpx" on these cells.
                    const leftVal = parseFloat(cell.style.left || '0');
                    const rightEdge = leftVal + cell.offsetWidth;
                    if (rightEdge > maxRight) maxRight = rightEdge;
                });

                fixedOffset = maxRight;
            }
        }

        if (fixedOffset === 0) {
            // Fallback: Try valid selectors if style parsing failed
            const lastFixed = thead?.querySelector('.ant-table-cell-fix-left-last') as HTMLElement;
            if (lastFixed) {
                // This cell marks the end of fixed section.
                // Its offsetLeft + offsetWidth should be it? 
                // Careful: offsetLeft is relative to TR/Table.
                fixedOffset = lastFixed.offsetLeft + lastFixed.offsetWidth;
            }
        }

        // 4. Execute Scroll
        // targetEl.offsetLeft is the distance from the left edge of the SCROLLABLE content.
        // We want that point to be at 'fixedOffset' pixels from the left of the VIEWPORT.
        // So scrollLeft = targetEl.offsetLeft - fixedOffset.

        const scrollToX = targetEl.offsetLeft - fixedOffset;

        // console.log('[useTableScroll]', { sectionKey, targetLeft: targetEl.offsetLeft, fixedOffset, scrollToX });

        scrollContainer.scrollTo({
            left: Math.max(0, scrollToX),
            behavior: 'smooth'
        });
    };

    return { scrollToSection };
};
