// src\components\chat\StreamingCursor.tsx 
export default function StreamingCursor() {
    return (
        <span
            className="
                ml-1
                inline-block
                h-5
                w-[2px]
                bg-current
                animate-blink
                align-middle
            "
        />
    );
}