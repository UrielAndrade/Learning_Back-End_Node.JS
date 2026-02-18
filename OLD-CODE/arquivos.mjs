import fs from "node:fs/promises";

try {
    await fs.mkdir('./produtos');
} catch {
    console.log('pasta ja existe');
}
await fs.writeFile('./produtos/notebook.json', JSON.stringify({
    nome: 'Notebook Intel, 128 RAM, 2TB',
    specs: ['i9', '2tb', '128ram'],
    system: 'Linux - Fedora'
}), 'utf-8');

const data = await fs.readFile('./produtos/notebook.json', 'utf-8');
const dir = await fs.readdir('./produtos', { recursive: true });
console.log(dir);
console.log(dir.filter((file) => file.endsWith('.json')));
console.log("Data \n" + data);
