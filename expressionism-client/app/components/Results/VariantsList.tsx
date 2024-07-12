"use client";

import { fetcherGet } from "@/app/api/fetchers";
import { GenerationResult, GenerationVariant } from "@/app/types/model";
import { cx, sva } from "@/styled-system/css";
import { Flex } from "@/styled-system/jsx";
import { CircleCheck } from "lucide-react";
import { ListBox, ListBoxPassThroughMethodOptions } from "primereact/listbox";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { boxStyles } from "./styles";

type VariantsListProps = {
    genResult: GenerationResult | null;
    onVariantSelect: (variant: Variant | null) => void;
};

const listStyles = sva({
    slots: ["root", "list", "wrapper", "item", "itemSelected", "emptyMessage"],
    base: {
        root: { h: "full" },
        wrapper: { h: "full" },
        list: {
            h: "full",
            listStyle: "none",
            overflowY: "auto",
        },
        item: {
            borderRadius: "md",
            p: 2,
            transition: "background-color 0.1s",
            _hover: {
                bgColor: "slate.3",
            },
            cursor: "pointer",
            mb: 1,
        },
        itemSelected: {
            background: "blue.4",
            cursor: "default",
            _hover: {
                bgColor: "blue.4",
            },
        },
        emptyMessage: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            w: "full",
            h: "full",
            color: "fg.subtle",
            textAlign: "center",
        },
    },
});

export type Variant = {
    id: number;
    name: string;
};

const VariantsList = ({ genResult, onVariantSelect }: VariantsListProps) => {
    const { data } = useSWR<GenerationVariant[]>(
        genResult ? `results/${genResult.id}/variants` : null,
        fetcherGet,
        {
            revalidateOnFocus: false,
        },
    );

    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

    useEffect(() => {
        if (data == null) return;

        const varts: Variant[] = data.map((gv, i) => ({ id: gv.id, name: "Вариант " + (i + 1) }));
        setVariants(varts);
        setSelectedVariant(varts.length > 0 ? varts[0] : null);
        onVariantSelect?.(varts.length > 0 ? varts[0] : null);
    }, [data, onVariantSelect]);

    useEffect(() => {
        if (genResult == null) {
            setVariants([]);
            setSelectedVariant(null);
        }
    }, [genResult]);

    const styles = listStyles();
    return (
        <div className={boxStyles.boxRoot}>
            <div className={boxStyles.boxHeader}>
                <h3>Варианты</h3>
                <span>всего: {variants.length}</span>
            </div>
            <div className={boxStyles.box}>
                <ListBox
                    value={selectedVariant}
                    optionLabel="name"
                    options={variants}
                    emptyMessage="Выберите результат из списка выше, чтобы просмотреть имеющиеся варианты"
                    onChange={(e) => {
                        setSelectedVariant(e.value);
                        onVariantSelect?.(e.value);
                    }}
                    itemTemplate={(option) => (
                        <Flex gap={3} alignItems="center">
                            <CircleCheck size={18} />
                            {option.name}
                        </Flex>
                    )}
                    unstyled
                    pt={{
                        root: { className: styles.root },
                        wrapper: { className: styles.wrapper },
                        list: { className: styles.list },
                        item: ({ context }: ListBoxPassThroughMethodOptions) => ({
                            className: cx(styles.item, context.selected && styles.itemSelected),
                        }),
                        emptyMessage: { className: styles.emptyMessage },
                    }}
                />
            </div>
        </div>
    );
};

export default VariantsList;
