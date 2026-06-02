import Module from './glyphix.js'

let glyphixModule = await Module();

document.getElementById('input-form').onsubmit = function (e) {
  e.preventDefault();   //prevent page reload
  runModule();
};

function runModule()
{
    const input = getInput();
    if(!input) return;

    const inputPtr = glyphixModule.stringToNewUTF8(JSON.stringify(input));
    const outputPtr = glyphixModule._run_glyphix(inputPtr);
    glyphixModule._free(inputPtr);

    if (!outputPtr) throw new Error("module returned NULL");

    const output = glyphixModule.UTF8ToString(outputPtr);
    glyphixModule._free_json(outputPtr);

    const data = JSON.parse(output);
    console.log(data);

    if(data.error){
        popup(data.errorMsg);
        return;
    } 

    document.getElementById('out-text').textContent = data.text;
    document.getElementById('output').classList.remove('hidden');
}

function getInput()
{
    let error = false;

    document.getElementById('err-textbox').classList.add('hidden');
    document.getElementById('err-size').classList.add('hidden');
    
    const text = document.getElementById('text').value.trim();
    if(text === ''){
        document.getElementById('err-textbox').classList.remove('hidden');
        error = true;
    }

    const sizeRaw = document.getElementById('size').value.trim();
    if(sizeRaw === ''){
        document.getElementById('err-size').classList.remove('hidden');
        error = true;
    }

    if(error) return null;
    
    const inputJSON = {
        size : Number(sizeRaw),
        text : text,
        style : '~'
    };
    return inputJSON;
}

function popup(msg){
    let pop = document.getElementById('popup');
    pop.querySelector('p').textContent = msg;
    pop.classList.remove('hidden');
    pop.querySelector('button').onclick = () => pop.classList.add('hidden');
}


