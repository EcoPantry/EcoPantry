import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/')({
    component: Index,
    loader: ({ context }) => () => {
        return context.user
    }
})

function Index() {
    const { data, isLoading } = useQuery({
        queryKey: ['time'],
        queryFn: () => Promise.resolve(new Date().toISOString()),
    });

    if (isLoading) return <p>Loading...</p>;
    return <p>Time: {data}</p>;
}