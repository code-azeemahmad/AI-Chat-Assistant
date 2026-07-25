// src/components/chat/ScrollToLatestButton.tsx

interface ScrollToLatestButtonProps {
    onClick(): void;
}

export default function ScrollToLatestButton({
    onClick,
}: ScrollToLatestButtonProps) {
    return (
        <button
            onClick={onClick}
            className="
                absolute
                bottom-24
                left-1/2
                -translate-x-1/2
                rounded-full
                bg-blue-600
                px-4
                py-2
                text-white
                shadow-lg
                hover:bg-blue-700
            "
        >
            ↓ Latest
        </button>
    );
}