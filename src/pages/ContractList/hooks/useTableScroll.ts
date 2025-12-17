import { useCallback, useEffect, useRef } from 'react';

export const useTableScroll = () => {

    const scrollToSection = useCallback((sectionKey: string) => {
        // 1. 找到目标锚点 (Header Cell)
        const targetClass = `col-anchor-${sectionKey}`;
        // 尝试找 th (表头) 或者 td (单元格)，优先表头
        const targetEl = document.querySelector(`th.${targetClass}`) as HTMLElement ||
            document.querySelector(`.${targetClass}`) as HTMLElement;

        if (!targetEl) {
            console.warn(`[useTableScroll] Target element .${targetClass} not found`);
            return;
        }

        // 2. 找到滚动容器
        const tableWrapper = targetEl.closest('.ant-table-wrapper');
        if (!tableWrapper) return;

        // Ant Design 的滚动容器通常是 .ant-table-body (有固定头时) 或 .ant-table-content
        const scrollContainer = tableWrapper.querySelector('.ant-table-body') as HTMLElement ||
            tableWrapper.querySelector('.ant-table-content') as HTMLElement;

        if (!scrollContainer) {
            console.warn('[useTableScroll] Scroll container not found');
            return;
        }

        // 3. 核心修复：重新计算固定列宽度 (fixedOffset)
        // 逻辑：找到表格里所有标记为 "fix-left" 的表头，把它们的实际宽度加起来。
        let fixedOffset = 0;

        // 获取 table 下的 thead
        const thead = tableWrapper.querySelector('.ant-table-thead');
        if (thead) {
            // 找到所有左侧固定的表头单元格
            // Note: Ant Design uses .ant-table-cell-fix-start (newer versions with RTL support)
            const fixedCells = thead.querySelectorAll('.ant-table-cell-fix-left, .ant-table-cell-fix-start');

            fixedCells.forEach((cell) => {
                // 累加它们的实际渲染宽度
                fixedOffset += (cell as HTMLElement).offsetWidth;
            });
        }

        // 4. 执行滚动
        // 目标位置 = 目标元素距离表格最左边的距离 - 左侧固定区域的宽度
        let scrollToX = targetEl.offsetLeft - fixedOffset;

        // 优化：给一点点缓冲 (Buffer)，不要贴得太死，比如多留 1px 防止边框重合，或者 0
        // 如果觉得贴得太紧，可以写 - 10
        scrollToX = Math.max(0, scrollToX);

        scrollContainer.scrollTo({
            left: scrollToX,
            behavior: 'smooth'
        });
    }, []);

    return { scrollToSection };
};

export const useTableScrollSpy = (
    wrapperRef: React.RefObject<any>,
    sections: string[],
    setActiveTab: (tab: string) => void,
    lockRef?: React.MutableRefObject<boolean> // New parameter
) => {
    // Use a ref to store sections to avoid effect re-running on array literal
    const sectionsRef = useRef(sections);
    sectionsRef.current = sections;

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const scrollContainer = wrapper.querySelector('.ant-table-body') as HTMLElement ||
            wrapper.querySelector('.ant-table-content') as HTMLElement;
        if (!scrollContainer) return;

        let rafId: number;
        let isScrolling = false; // Debounce flag if needed, but RAF is enough

        const checkActive = () => {
            if (lockRef && lockRef.current) return; // Guard: skip if locked

            if (!wrapper) return;

            // Calculate fixed offset
            let fixedOffset = 0;
            const thead = wrapper.querySelector('.ant-table-thead');
            if (thead) {
                const fixedCells = thead.querySelectorAll('.ant-table-cell-fix-left, .ant-table-cell-fix-start');
                fixedCells.forEach((cell: any) => {
                    fixedOffset += (cell as HTMLElement).offsetWidth;
                });
            }

            const currentScroll = scrollContainer.scrollLeft;
            const buffer = 10; // Scroll buffer

            // Find candidates
            const candidates = sectionsRef.current.map(section => {
                const targetClass = `col-anchor-${section}`;
                // Search inside wrapper to be safe
                const el = wrapper.querySelector(`.${targetClass}`) as HTMLElement;
                if (!el) return null;

                // Target scroll position for this section
                const targetScroll = el.offsetLeft - fixedOffset;
                return { section, targetScroll };
            }).filter((c): c is { section: string, targetScroll: number } => c !== null);

            // Sort by target position
            candidates.sort((a, b) => a.targetScroll - b.targetScroll);

            // Find the active section
            // It's the last section where currentScroll >= targetScroll - buffer
            let activeSection = candidates[0]?.section; // Default to first

            for (let i = candidates.length - 1; i >= 0; i--) {
                if (currentScroll >= candidates[i].targetScroll - buffer) {
                    activeSection = candidates[i].section;
                    break;
                }
            }

            if (activeSection) {
                setActiveTab(activeSection);
            }
            isScrolling = false;
        };

        const onScroll = () => {
            if (!isScrolling) {
                isScrolling = true;
                rafId = requestAnimationFrame(checkActive);
            }
        };

        scrollContainer.addEventListener('scroll', onScroll, { passive: true });

        // Check initially too (e.g. after data load)
        // Add a small delay to ensure rendering
        const timeoutId = setTimeout(checkActive, 500);

        return () => {
            scrollContainer.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(rafId);
            clearTimeout(timeoutId);
        };
    }, [wrapperRef, setActiveTab, lockRef]);
};
