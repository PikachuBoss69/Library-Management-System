interface StatCardProps {
    title: string;
    value: number | string;
    description: string;
}

export default function StatCard({
    title,
    value,
    description,
}: StatCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
                {value}
            </p>

            <p className="mt-1 text-xs text-gray-500">
                {description}
            </p>

        </div>
    );
}