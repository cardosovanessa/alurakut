import { SiteClient } from 'datocms-client' 
export default async function recebeRequests(req, res){

  if(req.method === 'POST'){
    const token = 'ef21fe9f9264968e9af6129bbe3eec';
    const client = new SiteClient(token); 
    const regCriado = await client.items.create({

      itemType: "967828",
      ...req.body  
    })

    res.json({
      dados: 'Dados',
      regCriado: regCriado 
    }) 
    return; 
    
  } 
  res.status(404).json({
    message: "Error" 
  })
}; 