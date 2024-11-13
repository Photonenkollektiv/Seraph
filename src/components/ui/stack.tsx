import { JSX } from "solid-js";

interface StackProps {
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
    alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    children: JSX.Element | JSX.Element[];
}

const Stack = (props: StackProps) => {
    const { justifyContent = "flex-start", alignItems = "stretch", direction = "row", children } = props;

    const stackStyle: JSX.CSSProperties = {
        display: "flex",
        "justify-content": justifyContent,
        "align-items": alignItems,
        "flex-direction": direction,
    };

    return <div style={stackStyle}>{children}</div>;
};

export default Stack;
