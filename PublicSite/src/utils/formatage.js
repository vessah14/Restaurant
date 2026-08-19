export function getInitiales(prenom, nom) {
  const initPrenom = prenom?.charAt(0).toUpperCase() || "";
const initNom = nom?.charAt(0).toUpperCase() || "";
return `${ initPrenom}${ initNom}`;
}