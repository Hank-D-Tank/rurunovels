import React from "react";

const DisplaySettings = ({ settingsContent, handleBgColorClick, handleFontFamilyClick, increaseFontSize, decreaseFontSize }) => {
    return (
        <div className="settings-story-sidebar">
            <h3>Display Settings</h3>
            <div className="settings-story">
                <span>Background</span>
                <div className="bg-colors">
                    {settingsContent.backgroundColors.map((bgColor, index) => (
                        <div
                            key={index}
                            className={`bg-color ${bgColor === settingsContent.backgroundColor ? 'active' : ''}`}
                            style={{ background: bgColor }}
                            onClick={() => handleBgColorClick(bgColor)}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="settings-story">
                <span>Font</span>
                <div className="fonts">
                    {settingsContent.fontFamilies.map((font, index) => (
                        <div
                            key={index}
                            className={`font ${font === settingsContent.fontFamily ? 'active' : ''}`}
                            style={{ fontFamily: font }}
                            onClick={() => handleFontFamilyClick(font)}
                        >
                            {font}
                        </div>
                    ))}
                </div>
            </div>

            <div className="settings-story">
                <span>Size</span>
                <div className="size">
                    <div className="btn-size" onClick={decreaseFontSize}>A-</div>
                    <div className="current-size">{settingsContent.fontSize}</div>
                    <div className="btn-size" onClick={increaseFontSize}>A+</div>
                </div>
            </div>
        </div>
    );
};

export default DisplaySettings;
