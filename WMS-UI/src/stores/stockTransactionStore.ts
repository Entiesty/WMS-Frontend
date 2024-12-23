import { defineStore } from 'pinia';
import type { StockTransaction } from "@/types/Data.ts";

export const useStockTransactionStore = defineStore('stockTransaction', {
    state: () => ({
        currentStockTransaction: null as StockTransaction | null,
    }),
    actions: {
        setCurrentStockTransaction(stockTransaction: StockTransaction) {
            this.currentStockTransaction = stockTransaction;
        },
    },
});
