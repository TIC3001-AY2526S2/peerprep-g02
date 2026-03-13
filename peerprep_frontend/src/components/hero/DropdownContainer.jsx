import { ChevronDown } from "lucide-react";

function DropdownContainer({label, options, selected, setSelected}) {

    return (
        <div className="topic-difficulty-box">
            <div className="topic-difficulty-font">{label}</div>
            <div className="dropdown">
                <button className="dropdown-button">{selected? selected : `Select ${label}`}
                    <ChevronDown size={18} className="dropdown-icon" />
                </button>
                <div className="dropdown-content">
                    {options.map(option => (
                        <div
                            key={option}
                            className="dropdown-item"
                            onClick={() => setSelected(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DropdownContainer;