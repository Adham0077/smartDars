import { WalletTransaction } from "../../entities/WalletTransaction.js";

export async function registerPayment(user, userRepository, paymentRepository, amount, status) {
    const payment = paymentRepository.create({
        userId: user.id,
        amount,
        status
    });

    await paymentRepository.save(payment);

    return payment;
}

export async function confirmPayment(payment, user, userRepository, paymentRepository) {
    if (payment.status === "pending") {
        user.balance += payment.amount;
        await userRepository.save(user);

        payment.status = "confirmed";
        await paymentRepository.save(payment);
    }
}
