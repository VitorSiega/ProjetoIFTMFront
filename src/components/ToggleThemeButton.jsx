import { Button } from "antd";
import React from "react";
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';

const ToggleThemeButton = ({ darkTheme, toggleTheme }) => {
    return (
        <div className="toggle-theme-btn">
            <Button onClick={toggleTheme}>
                {darkTheme ? <HiOutlineSun/> : <HiOutlineMoon/>}
            </Button>
        </div>
    );
};

export default ToggleThemeButton;


