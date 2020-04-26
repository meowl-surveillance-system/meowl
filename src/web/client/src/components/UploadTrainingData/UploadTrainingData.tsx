import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

const inputUploadFile: React.CSSProperties = {
    display: 'none',
};

const buttonUploadFile: React.CSSProperties = {
    margin: 8,
};

interface Props {
  isLoggedIn: boolean;
  onAuthChange: (authState: boolean) => void;
}
interface State {
  dragging: boolean;
  file: File | null;
}

class UploadTrainingData extends Component<Props, State> {
    // function to read file as binary and return
    private getFileFromInput(file: File): Promise<any> {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = function () { resolve(reader.result); };
            reader.readAsBinaryString(file); // here the file can be read in different way Text, DataUrl, ArrayBuffer
        });
    }

    private manageUploadedFile(binary: String, file: File) {
        // do what you need with your file (fetch POST, ect ....)
        console.log(`The file size is ${binary.length}`);
        console.log(`The file name is ${file.name}`);
    }

    private handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.persist();
        if(!event.target || !event.target.files){
            Array.from(event.target.files).forEach(file => {
                this.getFileFromInput(file)
                    .then((binary) => {
                        this.manageUploadedFile(binary, file);
                    }).catch(function (reason) {
                        console.log(`Error during upload ${reason}`);
                        event.target.value = ''; // to allow upload of same file if error occurs
                    });
            });
        }
    }


    public render(): JSX.Element {
        return (
            <Grid container style={grid}>
                <Grid item xs={12}>
                    <input accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" style={inputUploadFile} id="file" multiple={true} type="file"
                        onChange={this.handleFileChange} />
                    <label htmlFor="file">
                        <Button raised component="span" style={buttonUploadFile} onClick={e => e.stopPropagation()}>
                            Upload
                        </Button>
                    </label>
                </Grid>
            </Grid>
        );
    }
}
