import {Card} from "../shared/Utils.jsx";
import {useEffect, useRef, useState} from "react";
import {convertToTitleCase} from "../../utils/functions.js";

function DropdownComponent({topic, children, styleClass, cardStyleClass, bodyStyleClass}) {
    const [showFilter, setShowFilter] = useState(false)
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            console.log(event, containerRef.current)
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Check if the clicked element has the "remove-filter" class
                if (!event.target.classList.contains('remove-filter')) {
                    // Click occurred outside the container and not on an element with "remove-filter" class
                    setShowFilter(false);
                }
            }
        };

        if (showFilter) {
            // Add a click event listener when the container is open
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showFilter]);

    return (
        <div ref={containerRef} className={`filter-container ${styleClass ?? ""} ${showFilter ? "enable": ""}`}>
            <Card className={cardStyleClass}>
                <div className="cursor-pointer filter-head flex justify-between items-center" onClick={() => setShowFilter(prev => !prev)}>
                    <p>
                        {convertToTitleCase(topic)}
                    </p>
                    <span className={`arrow-icon ${showFilter ? "down": ""}`}>

                </span>
                </div>
                <div className={`filter-body ${showFilter ? "enable": ""} ${bodyStyleClass ?? ""}`}>
                    {children}
                </div>

            </Card>
        </div>
    );
}

export default DropdownComponent;