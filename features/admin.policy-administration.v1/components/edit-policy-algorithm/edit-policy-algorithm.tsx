/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { FunctionComponent, MouseEvent, ReactElement, SyntheticEvent, useEffect, useState } from "react";

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select from "@oxygen-ui/react/Select";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { useTranslation } from "react-i18next";
import "./edit-policy-algorithm.scss";
import { addAlert } from "@wso2is/core/store";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { updateAlgorithm } from "../../api/policy-algorithm";
import { PolicyAlgorithmRequestInterface } from "../../models/policies";

interface AlgorithmOption {
    value: number;
    label: string;
    description: string;
}

interface EditPolicyAlgorithmProps extends IdentifiableComponentInterface{
    closeModal: () => void;
    open: boolean;
    selectedAlgorithm: AlgorithmOption;
    setSelectedAlgorithm: (algorithm: AlgorithmOption) => void;
    algorithmOptions : AlgorithmOption[];
}

const EditPolicyAlgorithm: FunctionComponent<EditPolicyAlgorithmProps> = (
    props : EditPolicyAlgorithmProps): ReactElement => {
    const { closeModal, [ "data-componentid" ]: componentId, open, selectedAlgorithm, setSelectedAlgorithm, algorithmOptions } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();



    const handleSelectChange = (event) => {

        const selectedAlgorithm: AlgorithmOption = algorithmOptions.find((option: AlgorithmOption) => option.value === event.target.value);

        setSelectedAlgorithm(selectedAlgorithm);
    };

    const selectedOption = algorithmOptions.find(option => option.value === selectedAlgorithm.value);

    const handleUpdate = () => {
        const data: PolicyAlgorithmRequestInterface = {
            policyCombiningAlgorithm: selectedOption.label
        };

        updateAlgorithm(data).then(() => {

            dispatch(addAlert({
                description: "The policy combining algorithm has been updated successfully",
                level: AlertLevels.SUCCESS,
                message: "Update successful"
            }));

            closeModal();
        }) . catch ( () => {

            dispatch(addAlert({
                description: t("idvp:create.notifications.create.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("idvp:create.notifications.create.genericError.message")
            }));
            console.log("Error updating the policy combining algorithm");
        });
    };


    return (
        <Dialog
            aria-labelledby="policy-algorithm--modal"
            onClose={ closeModal }
            data-componentid={ componentId }
            maxWidth="md"
            className="policy-algorithm-modal"
            open={ open }
        >
            <DialogTitle>
                <Typography variant="h4">{ t("policyAdministration:policyAlgorithm.title") }</Typography>
            </DialogTitle>
            <DialogContent className="algorithm-content" dividers>
                <Typography variant="body1">
                    { t("policyAdministration:policyAlgorithm.actionText") }
                </Typography>
                <Select value={ selectedAlgorithm.value } onChange={ handleSelectChange } className="algorithm-dropdown">
                    { algorithmOptions.map((option: AlgorithmOption) => (
                        <MenuItem key={ option.value } value={ option.value }>
                            { option.label }
                        </MenuItem>
                    )) }
                </Select>
                <Alert severity="info" className="algorithm-description">
                    { selectedOption?.description }
                </Alert>

            </DialogContent>
            <DialogActions>
                <Box>
                    <Stack direction="row" justifyContent="space-between">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={ (e: MouseEvent<HTMLButtonElement>) => closeModal() }
                        >
                            { t("tenants:addTenant.actions.cancel.label") }
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            autoFocus
                            onClick={ handleUpdate }
                        >
                            { t("policyAdministration:policyAlgorithm.primaryBtn") }
                        </Button>
                    </Stack>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default EditPolicyAlgorithm;
