import { useQuery, useMutation, useQueryClient } from 'react-query';

const API_URL = 'http://localhost:8080/ingredients';

export function useIngredients() {
    return useQuery('ingredients', async () => {
        const res = await fetch(`${API_URL}?page=0&size=100`);
        return res.json();
    });
}

export function useAddIngredient() {
    const queryClient = useQueryClient();
    return useMutation(
        (data: any) =>
            fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }),
        { onSuccess: () => queryClient.invalidateQueries('ingredients') }
    );
}

export function useDeleteIngredient() {
    const queryClient = useQueryClient();
    return useMutation(
        (id: number) => fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' }),
        { onSuccess: () => queryClient.invalidateQueries('ingredients') }
    );
}
