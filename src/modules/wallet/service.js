export async function addBalance(user, userRepository, amount) {
    user.balance += Number(amount);
    await userRepository.save(user);
    return user.balance;
}
