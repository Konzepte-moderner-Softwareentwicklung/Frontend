interface StarRating {
    value: number;
    onChange: (value: number) => void;
    max?: number;
}

export function StarRating({ value, onChange, max = 5 }: StarRating) {
    return (
        <div className="flex space-x-1">
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;
                return (
                    <button
                        key={starValue}
                        type="button"
                        className={`w-8 h-8 ${
                            starValue <= value ? "text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => onChange(starValue)}
                    >
                        ★
                    </button>
                );
            })}
        </div>
    );
}
