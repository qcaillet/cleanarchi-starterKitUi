import { Button } from "@/components/ui/button"
import { useConfigActions } from "@/logic/useConfigActions";
import { useStartkitConfig } from "@/logic/useStartkitConfig";
import { Copy, Download, Upload } from "lucide-react"

function FooterSection() {

  const {
    config,
  } = useStartkitConfig();

  const { copyToClipboard, downloadConfig, importConfig } = useConfigActions();

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importConfig(file).catch(() => {
        // Error handling is done in the hook
      });
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 flex gap-3">
    <div className="relative">
      <input
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <Button variant="outline" className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Importer
      </Button>
    </div>
    <Button 
      onClick={() => copyToClipboard(config)} 
      variant="outline" 
      className="flex items-center gap-2"
    >
      <Copy className="w-4 h-4" />
      Copier JSON
    </Button>
    <Button 
      onClick={() => downloadConfig(config)} 
      className="flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Télécharger
    </Button>
  </div>  )
}

export default FooterSection