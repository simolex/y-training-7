class LazySegmentTree {
    constructor(data) {
        this.n = data.length;
        this.size = 1;
        while (this.size < this.n) {
            this.size <<= 1;
        }

        // Основное дерево (хранит текущие значения)
        this.tree = new Array(2 * this.size).fill(null);

        // Дерево отложенных операций
        this.lazy = new Array(2 * this.size).fill(null);

        // Заполняем листья
        for (let i = 0; i < this.n; i++) {
            this.tree[this.size + i] = data[i];
        }

        // Строим дерево (для этой задачи нам не нужно объединять узлы)
    }

    // Применить отложенную операцию к узлу
    _applyLazy(node, value, l, r) {
        this.tree[node] = value; // Просто заменяем значение
        if (l !== r) {
            // Если это не лист, помечаем детей для обновления
            this.lazy[2 * node] = value;
            this.lazy[2 * node + 1] = value;
        }
    }

    // Протолкнуть отложенную операцию в детей
    _pushLazy(node, nodeL, nodeR) {
        if (this.lazy[node] !== null) {
            const mid = Math.floor((nodeL + nodeR) / 2);
            this._applyLazy(2 * node, this.lazy[node], nodeL, mid);
            this._applyLazy(2 * node + 1, this.lazy[node], mid + 1, nodeR);
            this.lazy[node] = null;
        }
    }

    // Обновить диапазон [l, r] (1-based индексация)
    updateRange(l, r, value) {
        this._updateRange(1, 1, this.size, l, r, value);
    }

    // Внутренняя рекурсивная функция обновления диапазона
    _updateRange(node, nodeL, nodeR, l, r, value) {
        if (r < nodeL || nodeR < l) {
            return; // Диапазон полностью вне запроса
        }

        if (l <= nodeL && nodeR <= r) {
            // Текущий узел полностью входит в диапазон обновления
            this._applyLazy(node, value, nodeL, nodeR);
            return;
        }

        // Проталкиваем отложенные операции
        this._pushLazy(node, nodeL, nodeR);

        const mid = Math.floor((nodeL + nodeR) / 2);
        this._updateRange(2 * node, nodeL, mid, l, r, value);
        this._updateRange(2 * node + 1, mid + 1, nodeR, l, r, value);
    }

    // Получить значение элемента на позиции pos (1-based)
    getValue(pos) {
        return this._getValue(1, 1, this.size, pos);
    }

    // Внутренняя рекурсивная функция получения значения
    _getValue(node, nodeL, nodeR, pos) {
        if (nodeL === nodeR) {
            return this.tree[node];
        }

        // Проталкиваем отложенные операции
        this._pushLazy(node, nodeL, nodeR);

        const mid = Math.floor((nodeL + nodeR) / 2);
        if (pos <= mid) {
            return this._getValue(2 * node, nodeL, mid, pos);
        } else {
            return this._getValue(2 * node + 1, mid + 1, nodeR, pos);
        }
    }
}

// Пример использования
const data = new Array(10).fill(0); // Исходные данные (10 нулей)
const st = new LazySegmentTree(data);

st.updateRange(2, 5, 7); // Заменить элементы с 2 по 5 на 7
console.log(st.getValue(3)); // Выведет 7
st.updateRange(4, 8, 3); // Заменить элементы с 4 по 8 на 3
console.log(st.getValue(5)); // Выведет 3
console.log(st.getValue(2)); // Выведет 7 (так как позиция 2 не была перезаписана вторым обновлением)
