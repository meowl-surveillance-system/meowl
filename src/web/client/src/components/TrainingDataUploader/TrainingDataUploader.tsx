import React, { Component, ChangeEvent } from "react";
import { Button, Container, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";

export interface Props {
    isLoggedIn: boolean;
    onAuthChange: (authState: boolean) => void;
}

export interface State {
    selectedFiles: File[]
}

export default class TrainingDataUploader extends Component<Props, State> {
    fileInputRef: HTMLInputElement | null;

    constructor(props: Props) {
        super(props);
        this.fileInputRef = null;
        this.state = {
            selectedFiles: []
        };
    }

    /**
     * Store files on the instance state
     * @params event - The event that contains files for uploading
     */
    onFilesChange(event: ChangeEvent<HTMLInputElement>) {
        event.persist();
        if (event.target && event.target.files) {
            this.setState({ selectedFiles: Array.from(event.target.files) });
        } else {
            this.setState({ selectedFiles: [] });
        }
    }

    /**
     * Uploads files one by one and set selectedFiles to none after uploading
     */
    onFilesUpload() {
        this.state.selectedFiles.forEach(async (file) => {
            return await this.uploadFile(file);
        });
        this.setState({ selectedFiles: [] });
    }

    /**
     * Uploads file to the server
     * @param file - file containing images/videos of the user to train model
     * @returns true if successfully uploads the file to server else false
     */
    async uploadFile(file: File): Promise<boolean> {
        const formData = new FormData();
        formData.append('TrainingData', file, file.name);
        return await fetch('/cv/upload/trainingData', {
            method: 'PUT',
            mode: 'same-origin',
            credentials: 'same-origin',
            body: formData,
        }).then((response) => {
            if (response.ok) {
                return true;
            } else {
                console.error(response.json());
                return false;
            }
        }).catch((error) => {
            console.error(error);
            return false;
        });
    }

    /**
     * Click on the file-input element to open up the file selection prompt
     */
    promptFileInput() {
        if (this.fileInputRef) {
            this.fileInputRef.click();
        } else {
            console.error('Unable to click on file input element.')
        }
    }

    /**
     * Renders TrainingDataUploader component
     * 
     * Renders a table listing out the files on the selectedFiles state
     * and two buttons for selecting files and uploading files
     */
    render(): JSX.Element {
        return (
            <Container component="main" maxWidth="xs">
                <TableContainer component={Paper}>
                    <Table className='trainingDataFile' aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">File Name</TableCell>
                                <TableCell align="right">Size</TableCell>
                                <TableCell align="right">Last Modified</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.selectedFiles.map((file) => (
                                <TableRow key={file.name}>
                                    <TableCell component="th" scope="row">
                                        {file.name}
                                    </TableCell>
                                    <TableCell align="right">{file.size}</TableCell>
                                    <TableCell align="right">{new Date(file.lastModified).toDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <input
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    id="file-input"
                    ref={(ref) => { this.fileInputRef = ref }}
                    multiple={true}
                    style={{ display: 'none' }}
                    type="file"
                    onChange={(e) => this.onFilesChange(e)}
                />
                <Button onClick={() => this.promptFileInput()}>
                    Select
                    </Button>
                <Button onClick={() => this.onFilesUpload()}>
                    Upload
                    </Button>
            </Container>
        );
    }
}
