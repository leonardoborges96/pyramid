const jestRegex = /it\('/g;
const jestContractRegex = /it\("/g;
const e2eRegex = /Scenario/g;

const defaultPath = './src';

const fs = require('fs');

const config = {
  unit: {
    path: defaultPath,
    suffix: 'unit.test',
    regex: jestRegex,
  },
  comp: {
    path: defaultPath,
    suffix: 'comp.test',
    regex: jestRegex,
  },
  int: {
    path: defaultPath,
    suffix: 'int.test',
    regex: jestRegex,
  },
  si: {
    path: defaultPath,
    suffix: 'si.test',
    regex: jestRegex,
  },
  contract: {
    path: './../test/contract-test/apis',
    suffix: 'contract.test',
    regex: jestContractRegex,
  },
  e2e: {
    path: './../test/e2e/cypress',
    suffix: '.feature',
    regex: e2eRegex,
  },
};

function readContentFile(filepath, regex) {
  const contents = fs.readFileSync(filepath, 'utf8'); // lê o arquivo
  return (contents.match(regex) || []).length;
  // retorna a quantidade de ocorrências da regex que identifica cada cenário de teste
}

function readTsFiles(directory, type, regex) {
  let count = 0;

  fs.readdirSync(directory).forEach(file => { // para cada arquivo presente dentro de directory
    const stat = fs.statSync(`${directory}/${file}`);
    if (stat.isDirectory()) { // é um diretório?
      count += readTsFiles(`${directory}/${file}`, type, regex); // chama a mesma função recursivamente com o "novo diretório"
    } else if (file.indexOf(type) !== -1) { // o arquivo é do tipo type?
      const filepath = `${directory}/${file}`;
      count += readContentFile(filepath, regex); // chama a função de leitura do conteúdo do arquivo
    }
  });

  return count;
}

const unitTestCount = readTsFiles(
  config.unit.path,
  config.unit.suffix,
  config.unit.regex,
);

const compTestCount = readTsFiles(
  config.comp.path,
  config.comp.suffix,
  config.comp.regex,
);

const intTestCount = readTsFiles(
  config.int.path,
  config.int.suffix,
  config.int.regex,
);

const siTestCount = readTsFiles(
  config.si.path,
  config.si.suffix,
  config.si.regex,
);

const contractTestCount = readTsFiles(
  config.contract.path,
  config.contract.suffix,
  config.contract.regex,
);

const e2eTestCount = readTsFiles(
  config.e2e.path,
  config.e2e.suffix,
  config.e2e.regex,
);

const tests = {
  u: unitTestCount,
  cp: compTestCount,
  i: intTestCount,
  si: siTestCount,
  ct: contractTestCount,
  e: e2eTestCount,
};

const data = JSON.stringify(tests);
fs.writeFileSync('pyramid/testPyramid.json', data);
