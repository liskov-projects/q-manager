import Papa from "papaparse";

const useDocumentUpload = () => {
    function handleCSV(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function(event){
                if(event.target?.result){
                    Papa.parse(event.target.result as string), {
                        header: true,
                        skipEmptyLines: true,
                        complete: function(results){
                            console.log("parsed csv");
                            const players = results.data.map((row: any)=>{
                                names: row.names.trim(),
                                categories: row.categories.trim(),
                                phoneNumbers: row.phoneNumbers.split(", ").map((phone:string)=> phone.trim())
                            })
                        }
                    }
                }
            }
        }
    }
}