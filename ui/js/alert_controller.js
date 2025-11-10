const alertController = (target= document, type = "success", message = "") =>
{
    const alertBox = target.querySelector(".alert")
    const title = alertBox.getElementsByTagName("h2")[0]
    const messageTag = alertBox.getElementsByTagName("p")[0]

    title.innerHTML = type[0].toUpperCase() + type.substring(1, type.length)
    messageTag.innerHTML = message

    if (type === "failure")
    {
        alertBox.classList.add("alert-failure")
        alertBox.classList.remove("alert-success")
    }
}

export default alertController;