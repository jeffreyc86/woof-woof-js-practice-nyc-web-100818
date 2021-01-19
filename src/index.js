document.addEventListener('DOMContentLoaded', e => {
  // const domController = new DOMController
  renderDogBar()
  dogBarListener()
  filterOnOff()
  toggleGoodBad()
})

const url = `http://localhost:3000/pups`

const renderDogBar = () => {
  fetch(url)
  .then(response => response.json())
  .then(dogs => {
      dogs.forEach(dog => {
        const newSpan = document.createElement("SPAN")
          newSpan.dataset.id = dog.id
          newSpan.innerText = dog.name
        document.querySelector("#dog-bar").append(newSpan)
      })
  }) 
}

const showDog = id => {
  const dogInfo = document.getElementById("dog-info")
    dogInfo.innerHTML = ""
  
  fetch(`${url}/${id}`)
  .then(response => response.json())
  .then(dog => {
    
    const newDiv = document.createElement("div")
      newDiv.dataset.id = dog.id
    const newH2 = document.createElement("h2")
      newH2.innerText = dog.name
    const newImg = document.createElement("img")
      newImg.src = dog.image
    const newButton = document.createElement("button")
      newButton.dataset.good = dog.isGoodDog
      newButton.innerText = goodOrBad(dog)

    newDiv.append(newImg, newH2, newButton)
    dogInfo.append(newDiv)
  })
}

const dogBarListener = () => {
  document.body.addEventListener('click', e => {
    if (e.target.matches("SPAN")){
      showDog(e.target.dataset.id)
    }
  })
}

const goodOrBad = dog => {
  if (dog.isGoodDog === true){
    return "Good Dog!"
  } else {
    return "Bad Dog!"
  }
}


const filterOnOff = () => {
  const goodDogButton = document.querySelector("#good-dog-filter")
  goodDogButton.addEventListener('click', (e) => {
    if (e.target.dataset.on === "false") {
      e.target.innerText = "Filter good dogs: ON"
      e.target.dataset.on = true

      document.querySelector("#dog-bar").innerHTML = ""
      
      fetch(url)
      .then(response => response.json())
      .then(dogs => {
          dogs.forEach(dog => {
            if (dog.isGoodDog === true) {
            const newSpan = document.createElement("SPAN")
              newSpan.dataset.id = dog.id
              newSpan.innerText = dog.name
            document.querySelector("#dog-bar").append(newSpan)
            }
          })
      }) 
    } else {
      document.querySelector("#dog-bar").innerHTML = ""
      e.target.innerText = "Filter good dogs: OFF"
      e.target.dataset.on = false
      renderDogBar()
    }
  })
}

const toggleGoodBad = () => {
  const dogDiv = document.querySelector("#dog-info")

  dogDiv.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
      const id = e.target.closest("div").dataset.id
      let trueOrFalse = true

      if (e.target.dataset.good === 'true'){
        trueOrFalse = !trueOrFalse
      }

      fetch(`${url}/${id}`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"isGoodDog": trueOrFalse})
        })
      .then(response => response.json())
      .then(updatedDog => {
        e.target.dataset.good = updatedDog.isGoodDog
        e.target.innerText = goodOrBad(updatedDog)
      })
    }
  })
}