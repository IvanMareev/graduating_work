import { Box, Flex } from "@/styled-system/jsx";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";

const GenerationPopup = (props: {
    accept?: (e: React.MouseEvent<HTMLButtonElement>, variantsCount: number) => void;
}) => {
    const [variantsCount, setVariantsCount] = useState(2);

    return (
        <ConfirmPopup
            group="generation"
            content={({ acceptBtnRef, hide }) => {
                return (
                    <Box p={3}>
                        <p>Количество вариантов:</p>
                        <Flex gap={2}>
                            <InputNumber
                                id="variants-count"
                                value={variantsCount}
                                invalid={variantsCount == null}
                                min={1}
                                max={100}
                                useGrouping={false}
                                onValueChange={(e) => setVariantsCount(e.value)}
                                showButtons
                                buttonLayout="stacked"
                            />
                            <Button
                                ref={acceptBtnRef}
                                type="button"
                                size="small"
                                label="Продолжить"
                                disabled={variantsCount == null}
                                onClick={(e) => {
                                    props.accept?.(e, variantsCount);
                                    hide();
                                }}
                            />
                        </Flex>
                    </Box>
                );
            }}
        />
    );
};

export default GenerationPopup;
