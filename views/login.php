<span><?=$params['msg']?></span> |
If u dont have accaunt, pls <a href="/?controller=users&action=registration">sign up</a>
<form action="/?controller=users&action=login" method="POST">
    <input  type="text" name="email" value="<?=$params['email']?>">
    <input  type="text" name="password" value="<?=$params['password']?>">
    <input  type="submit" name="submit" value="sign in">
</form>