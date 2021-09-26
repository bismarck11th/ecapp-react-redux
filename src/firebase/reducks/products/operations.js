import { fetchProductsAction, deleteProductAction } from './actions.js';
import { push } from 'connected-react-router';
// Firebase
import { db, FirebaseTimestamp } from '../../firebase/';

const productsRef = db.collection('products');

export const fetchProducts = (gender, category) => {
  return async (dispatch) => {
    // 複合index (firestore.indexes.jsonで設定が可能 -> ２つ以上の条件・ソートのクエリのパフォーマンスが向上)
    let query = productsRef.orderBy('updated_at', 'desc');
    query = gender !== '' ? query.where('gender', '==', gender) : query;
    query = category !== '' ? query.where('category', '==', category) : query;

    query.get('products').then((snapshots) => {
      const productList = [];
      snapshots.forEach((snapshot) => {
        const product = snapshot.data();
        productList.push(product);
      });
      dispatch(fetchProductsAction(productList));
    });
  };
};

export const orderProduct = (productsInCart, amount) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const userRef = db.collection('users').doc(uid);
    const timestamp = FirebaseTimestamp.now();

    // 注文履歴用
    let products = [];
    let soulOutProducts = [];

    const batch = db.batch();

    for (const product of productsInCart) {
      const snapshot = await productsRef.doc(product.productId).get();
      const sizes = snapshot.data().sizes;

      const updatedSizes = sizes.map((size) => {
        if (size.size === product.size) {
          if (size.quantity === 0) {
            soulOutProducts.push(product.name);
            return size;
          }
          return { size: size.size, quantity: size.quantity - 1 };
        } else {
          return size;
        }
      });

      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size
      });

      batch.update(productsRef.doc(product.productId), { sizes: updatedSizes });

      batch.delete(userRef.collection('cart').doc(product.cartId));
    }

    if (soulOutProducts.length > 0) {
      const errorMessage =
        soulOutProducts.length > 1
          ? soulOutProducts.join('と')
          : soulOutProducts[0];
      alert(
        `大変申し訳ございません。${errorMessage}が在庫切れとなったため、注文処理を中断しました。`
      );
      return false;
    } else {
      batch
        .commit()
        .then(() => {
          const orderRef = userRef.collection('orders').doc();
          const date = timestamp.toDate();
          const shippingDate = FirebaseTimestamp.fromDate(
            new Date(date.setDate(date.getDate() + 3))
          );

          const history = {
            amount: amount,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shippingDate,
            updated_at: timestamp
          };
          orderRef.set(history);

          dispatch(push('/order/complete'));
        })
        .catch(() => {
          alert(
            '注文処理が失敗しました。通信環境をご確認の上、もう一度お試しください。'
          );
          return false;
        });
    }
  };
};

export const saveProduct = (
  id,
  images,
  name,
  description,
  category,
  gender,
  price,
  sizes
) => {
  return async (dispatch) => {
    const timestamp = FirebaseTimestamp.now();

    // 保存するデータ作成
    const data = {
      images: images,
      name: name,
      description: description,
      category: category,
      gender: gender,
      price: parseInt(price, 10),
      sizes: sizes,
      updated_at: timestamp
    };

    // 新規作成のみ(編集ではないとき)
    if (id === '') {
      // 新規doc作成
      const ref = productsRef.doc();
      id = ref.id;
      data.id = id;
      data.created_at = timestamp;
    }

    // firestoreに保存
    return productsRef
      .doc(id)
      .set(data, { merge: true })
      .then(() => {
        dispatch(push('/'));
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
};

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    productsRef
      .doc(id)
      .delete()
      .then(() => {
        const prevProduct = getState().products.list;
        // 今回のidに一致しないものだけを返す
        const nextProduct = prevProduct.filter((product) => product.id !== id);
        dispatch(deleteProductAction(nextProduct));
      });
  };
};
