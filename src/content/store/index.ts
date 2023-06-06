
class Store{
  state:Record<string,any>
  constructor(){
    this.state={}
  }

  setValue(key:string,value:any){
    this.state[key]=value
  }

  getValue(key:string){
    return this.state[key]
  }
}

export default new Store