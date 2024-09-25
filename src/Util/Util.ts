export const convertdate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short"
    }).format(new Date(date))
}

