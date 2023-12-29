import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface ZoomableDivProps {
    children: ReactNode;
    innerDivRef: React.RefObject<HTMLDivElement>;
}

const ZoomWrapper: React.FC<ZoomableDivProps> = ({ children, innerDivRef }) => {
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [mouseIn, setMouseIn] = useState<boolean>(false);
    const [dragging, setDragging] = useState<boolean>(false);
    const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });


    const handleWheel = (e: WheelEvent) => {
        // Check if the Ctrl key is held down
        if (e.ctrlKey) {
            // Prevent the default behavior of scrolling
            e.preventDefault();

            // Adjust the zoom level based on the wheel delta
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            setZoomLevel((prevZoom) => Math.max(0.1, prevZoom + delta));
        }
    };
    const handleMouseDown = (e: React.MouseEvent) => {
        // Check if the right mouse button is pressed
        if (e.button === 2) {
            e.preventDefault();
            console.log("Mouse down")
            setDragging(true);
            dragStart.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        console.log("Mouse up")
        setDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging && innerDivRef.current) {
            console.log("Mouse move")
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            dragStart.current = { x: e.clientX, y: e.clientY };
            innerDivRef.current.scrollLeft -= dx / zoomLevel;
            innerDivRef.current.scrollTop -= dy / zoomLevel;
            console.log("Scroll left", innerDivRef.current.scrollLeft, dx, dy, zoomLevel)
        }
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);

        };
    }, [dragging]);


    useEffect(() => {
        // Attach the wheel event listener to the window object
        if (mouseIn) {
            window.addEventListener('wheel', handleWheel, { passive: false });

            // Cleanup the event listener on component unmount
            return () => {
                window.removeEventListener('wheel', handleWheel);
            };
        }
    }, [mouseIn]);
    return (
        <div
            style={{
                overflow: 'hidden',
            }}
            onMouseEnter={() => setMouseIn(true)}
            onMouseLeave={() => setMouseIn(false)}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div

                style={{
                    width: '100%',
                    height: '100%',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    transition: 'transform 0.3s ease',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ZoomWrapper;
