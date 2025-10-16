import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";
import React from "react";

describe("Button Tests", () =>
{
    it("renders properly with text", () =>
    {
        render(<Button>Submit</Button>);
        const btn = screen.getByRole("button");
        expect(btn).toBeInTheDocument();
        expect(btn.textContent).toBe("Submit");
    });

    it("is disabled when passed disabled prop", () =>
    {
        render(<Button disabled>Disabled</Button>);
        const btn = screen.getByRole("button");
        expect(btn).toBeDisabled();
    });

    it("calls onClick when clicked", () =>
    {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const btn = screen.getByRole("button");
        fireEvent.click(btn);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
