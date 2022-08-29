<script language="javascript">
    function showCompletionPopup() {
        let path = window.location.pathname;
        path = path.endsWith('/') ? path.slice(0, -1) : path;
        let pathArray = path.split('/');
        let leafFolder = pathArray[pathArray.length-1];

        let height = window.outerHeight / 1.5;
        let width = window.outerWidth / 2;

        window.open(`${window.origin}/app-camp/congrats/${leafFolder}`,
                    'Congratulations!',
                    `width=${width}, height=${height}, left=100, top=100,`);
    }
</script>

## Congratulations!

<button type="button" onclick="showCompletionPopup();" class="largeButton">When you have finished this lab,<br />please click this button to let us know!</button>

<p>No personal information is collected; we only want to count how many people have completed the labs so we can continue to fund this work!</p>
 