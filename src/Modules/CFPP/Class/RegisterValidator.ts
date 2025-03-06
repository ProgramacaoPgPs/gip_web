interface Register {
    id_record_type_fk: string;
    times: string;
}

export default class RegisterValidator {
    private list: Register[];

    constructor(initialList: Register[] = []) {
        this.list = initialList;
    }

    // Getter para a lista atual
    getList(): Register[] {
        return this.list;
    }

    // Verifica se um id_record_type_fk já existe na lista
    private isIdAlreadyExists(id: string): boolean {
        return this.list.some(item => item.id_record_type_fk === id);
    }

    // Verifica se o id_record_type_fk = 3 tem um 2 antes dele
    private hasValidPredecessorForThree(): boolean {
        const lastTwoIndex = this.list.findIndex(item => item.id_record_type_fk === "2");
        return lastTwoIndex !== -1;
    }

    // Verifica se o times do 3 é maior que o times do 2 que o antecede
    private isThreeTimeValid(newTime: string): boolean {
        let response = false; // Variável para controlar o resultado
    
        const lastTwoIndex = this.list.findIndex(item => item.id_record_type_fk === "2");
    
        if (lastTwoIndex !== -1) {
            const lastTwoTime = this.list[lastTwoIndex].times;
            if (new Date(newTime) >= new Date(lastTwoTime)) {
                response = true; // O times do 3 é válido
            }
        }
    
        return response; // Único retorno
    }

    // Verifica se o times do 4 é maior que todos os times anteriores
    private isFourTimeValid(newTime: string): boolean {
        const allTimes = this.list.map(item => new Date(item.times).getTime());
        const newTimeMs = new Date(newTime).getTime();
        return allTimes.every(time => newTimeMs >= time);
    }

    // Função principal de validação
    private isValidToAdd(newItem: Register): void {
        const { id_record_type_fk, times } = newItem;

        // Regra 1: id_record_type_fk 1 e 4 só podem aparecer uma vez
        if (["1", "4"].includes(id_record_type_fk) && this.isIdAlreadyExists(id_record_type_fk)) {
            throw new Error(`id_record_type_fk ${id_record_type_fk} já existe na lista.`);
        }

        // Regra 2: id_record_type_fk = 3 precisa de um 2 antes e um times válido
        if (id_record_type_fk === "3") {
            if (!this.hasValidPredecessorForThree()) {
                throw new Error("Não há um registro com id_record_type_fk = 2 antes de adicionar o 3.");
            }
            if (!this.isThreeTimeValid(times)) {
                throw new Error("O times do 3 não pode ser menor que o times do 2 que o antecede.");
            }
        }

        // Regra 3: id_record_type_fk = 4 precisa ter o maior times
        if (id_record_type_fk === "4" && !this.isFourTimeValid(times)) {
            throw new Error("O times do 4 não pode ser menor que os times dos itens 1, 2 e 3 que o antecedem.");
        }
    }

    // Adiciona um novo item à lista, se for válido
    addItem(newItem: Register): void {
        try {
            this.isValidToAdd(newItem); // Valida o item
            this.list = [...this.list, newItem]; // Adiciona o item à lista
            console.log("Item adicionado com sucesso!");
        } catch (error:any) {
            console.error(`Erro ao adicionar item: ${error.message}`);
        }
    }
}