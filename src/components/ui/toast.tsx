'use client';
import { Root, Title, Description } from "@radix-ui/react-toast";
import { useToast } from "@/context/ToastContext";

const Toasify = () => {
    const { open, setOpen, title, description, variant  } = useToast();

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Root
            open={open}
            className={` ${variant === "error"
                ? "bg-red-500 text-white"
                : variant === "success"
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                } rounded-md p-4`}
        >
            <Title className="font-bold">{title}</Title>
            <Description>{description}</Description>
            <button onClick={handleClose} className="mt-2 text-sm underline">
                Close
            </button>
        </Root>

    );
}

export default Toasify;