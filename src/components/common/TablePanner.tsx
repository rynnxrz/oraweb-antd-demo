import React, { useLayoutEffect, useState, useRef } from 'react';
import { Slider, theme } from 'antd';

interface TablePannerProps {
    tableRef: any; // Using any to be compatible with both RefObject types and nullability
    style?: React.CSSProperties;
}

const TablePanner: React.FC<TablePannerProps> = ({ tableRef, style }) => {
    const { token } = theme.useToken();
    const [max, setMax] = useState(0);
    const [value, setValue] = useState(0);
    const scrollContainerRef = useRef<HTMLElement | null>(null);

    // Helper to find the scroll container (ant-table-body)
    const findScrollContainer = () => {
        if (!tableRef?.current) return null;
        // Ant Design v5 usually puts scroll on .ant-table-body
        return tableRef.current.querySelector('.ant-table-body') as HTMLElement ||
            tableRef.current.querySelector('.ant-table-content') as HTMLElement;
    };

    const recompute = () => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const nextMax = Math.max(0, el.scrollWidth - el.clientWidth);
        setMax(nextMax);
        setValue(Math.min(el.scrollLeft, nextMax));
    };

    useLayoutEffect(() => {
        let mounted = true;
        let cleanupFn: (() => void) | undefined;

        const setupListeners = (el: HTMLElement) => {
            recompute();

            // Scroll Listener
            let rafId = 0;
            const onScroll = () => {
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    if (el) setValue(el.scrollLeft);
                });
            };
            el.addEventListener('scroll', onScroll, { passive: true });

            // Resize Observer
            const ro = new ResizeObserver(recompute);
            ro.observe(el);

            return () => {
                el.removeEventListener('scroll', onScroll);
                ro.disconnect();
                cancelAnimationFrame(rafId);
            };
        };

        const checkAndBind = () => {
            if (!mounted) return;
            const el = findScrollContainer();
            if (el && el !== scrollContainerRef.current) {
                scrollContainerRef.current = el;
                cleanupFn = setupListeners(el);
            } else if (!el) {
                requestAnimationFrame(checkAndBind);
            }
        };

        checkAndBind();

        return () => {
            mounted = false;
            if (cleanupFn) cleanupFn();
        };
    }, [tableRef]);

    const onChange = (val: number) => {
        setValue(val);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = val;
        }
    };

    // Only show if there is something to scroll
    if (max <= 0) return null;

    return (
        <div style={{
            width: 200,
            padding: '0 12px',
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            display: 'flex',
            alignItems: 'center',
            height: 32,
            ...style
        }}>
            <Slider
                min={0}
                max={max}
                value={value}
                onChange={onChange}
                tooltip={{ open: false }}
                style={{ width: '100%', margin: '6px 0' }}
            />
        </div>
    );
};

export default TablePanner;
