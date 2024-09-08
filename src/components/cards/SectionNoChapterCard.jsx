import React, { useState, useEffect, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { Link } from "react-router-dom";

const SectionNoChapterCard = ({
    novelId,
    novelCoverImg,
    novelTitle,
    novelSynopsis,
    novelTags,
    edit = false,
    editDropDown
}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const handleEditClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="single-card single-card-no-chapter">
            {edit && (
                <div className="edit-container" ref={dropdownRef}>
                    <button className="edit" onClick={handleEditClick}>
                        <HiDotsVertical />
                    </button>
                    {dropdownVisible && (
                        <div className="edit-dropdown">
                            {editDropDown.map((item, index) => (
                                <li key={index}>
                                    {item.to ? (
                                        <Link to={item.to}>{item.label}</Link>
                                    ) : (
                                        <button onClick={item.onClick}>{item.label}</button>
                                    )}
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="single-card-bg-image">
                <img src={novelCoverImg} alt={"Cover Image Of " + novelTitle} />
            </div>
            <div className="single-card-info">
                <div className="single-card-novel-title">
                    <p style={{ cursor: "pointer" }}>
                        <Link to={"/about/" + novelId + "/"}>{novelTitle}</Link>{" "}
                    </p>
                </div>
                <div className="single-card-novel-description">
                    <p>{novelSynopsis}</p>
                </div>
                <div className="single-card-novel-genre">
                    {novelTags.map((novelTag, index) => (
                        <Link
                            to={`/library/filter?genre=${novelTag}`}
                            key={index}
                            className={"badge " + novelTag.toLowerCase()}
                        >
                            {novelTag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionNoChapterCard;
