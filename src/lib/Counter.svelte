<script lang="ts">
  let count = 0

  function increment() {
    count += 1
  }
</script>

<button on:click={increment}>
  count is {count}
</button>

<style>
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: #f0f0f0;
    border-radius: 2em;
    border: 2px solid #ff3e00;
    outline: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #e0e0e0;
  }

  button:active {
    background-color: #d0d0d0;
  }
</style>