import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades){
  return(
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}></img>
      <hr/>
      <p>
        <a className='boxLink' href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
      { propriedades.title } ({ propriedades.items.length })
      </h2>

      <ul>
        {}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(){
  const githubUser = 'cardosovanessa';

  const [comunidades, setComunidades] = React.useState([]);

  const pessoasFavoritas = [
    'kariariga',
    'daygds12', 
    'luizzzabiassi',
    'maateusilva', 
    'omariosouto', 
    'peas', 
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/users/cardosovanessa/followers`)
    .then((respServidor) => {
      return respServidor.json();
    })
    .then((respCompleta) => {
      setSeguidores(respCompleta);
    })

    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '786bd4f7a9411cf8b6783e9687a09e',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
          }
        }`
      })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna. 
    .then((respostaCompleta) => {
      const comunidadesDato = respostaCompleta.data.allCommunities
      console.log(comunidadesDato)
        setComunidades(comunidadesDato)
    })
  }, [])

  return(
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        <div className='profileArea' style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className='welcomeArea' style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className='title'>
              Bem-Vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className='subTitle'>O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e){
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
                creatorSlug: githubUser
              }

              fetch('/api/communities', { 
                method: 'POST', 
                headers: { 
                  'Content-Type': 'application/json' 
                }, 
                body: JSON.stringify(comunidade) 
              }) 
              .then(async (res) => { 
                  
                const dados = await res.json(); 
                console.log(dados.regCriado); 
                const comunidade = dados.regCriado; 
                const comunidadesAtualizadas = [...comunidades, comunidade]; 
                setComunidades(comunidadesAtualizadas) 
                
              }) 

            }}>
              <div>
                <input placeholder='Qual vai ser o nome da sua comunidade?' name='title' aria-label='Qual vai ser o nome da sua comunidade?' type='text'/>
              </div>
              <div>
                <input placeholder='Coloque uma URL para usarmos de capa.' name='image' aria-label='Coloque uma URL para usarmos de capa.'/>
              </div>
              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>
        <div className='profileRelationsArea' style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBox title='Seguidores' items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>
              Comunidades ({comunidades.length})
            </h2>

              <ul>
                {comunidades.map((itemAtual) => {
                  return(
                    <li key={itemAtual.id}>
                      <a href={`/communities/${itemAtual.id}`}>
                        <img src={itemAtual.imageUrl} />
                        <span>{itemAtual.title}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
            <ProfileRelationsBoxWrapper>
              <h2 className='smallTitle'>
              Meus amigos ({pessoasFavoritas.length})
              </h2>
            
            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return(
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
};