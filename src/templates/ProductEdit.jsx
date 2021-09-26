import React, { useCallback, useEffect, useState } from 'react';
// Redux
import { useDispatch } from 'react-redux';
import { saveProduct } from '../reducks/products/operations';
// Firebase
import { db } from '../firebase/index';
// Component
import { PrimaryButton, SelectBox, TextInput } from '../components/UIkit/';
import { ImageArea, SetSizeArea } from '../components/products/';

const ProductEdit = () => {
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [gender, setGender] = useState('');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([]);

  const inputUsername = useCallback(
    (e) => {
      setName(e.target.value);
    },
    [setName]
  );

  const inputDescription = useCallback(
    (e) => {
      setDescription(e.target.value);
    },
    [setDescription]
  );

  const inputPrice = useCallback(
    (e) => {
      setPrice(e.target.value);
    },
    [setPrice]
  );

  const genders = [
    { id: 'all', name: 'すべて' },
    { id: 'male', name: 'メンズ' },
    { id: 'femail', name: 'レディース' }
  ];

  // URLからproduct id取得
  let id = window.location.pathname.split('/product/edit')[1];
  if (id !== '') {
    id = id.split('/')[1];
  }

  // 編集時、URLのproduct idに紐づくデータをセット
  useEffect(() => {
    if (id !== '') {
      db.collection('products')
        .doc(id)
        .get()
        .then((snapshot) => {
          const data = snapshot.data();
          setImages(data.images);
          setName(data.name);
          setDescription(data.description);
          setCategory(data.category);
          setGender(data.gender);
          setPrice(data.price);
          setSizes(data.sizes);
        });
    }
  }, [id]);

  useEffect(() => {
    db.collection('categories')
      .orderBy('order', 'asc')
      .get()
      .then((snapshots) => {
        const list = [];
        snapshots.forEach((snapshot) => {
          const data = snapshot.data();
          list.push({
            id: data.id,
            name: data.name
          });
        });
        setCategories(list);
      });
  }, []);

  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録と編集</h2>
      <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullWidth={true}
          label={'商品名'}
          multiline={false}
          required={true}
          rows={1}
          value={name}
          type={'text'}
          onChange={inputUsername}
        />
        <TextInput
          fullWidth={true}
          label={'商品説明'}
          multiline={true}
          required={true}
          rows={5}
          value={description}
          type={'text'}
          onChange={inputDescription}
        />
        <SelectBox
          label={'カテゴリー'}
          required={true}
          options={categories}
          select={setCategory}
          value={category}
        />
        <SelectBox
          label={'性別'}
          required={true}
          options={genders}
          select={setGender}
          value={gender}
        />
        <TextInput
          fullWidth={true}
          label={'価格'}
          multiline={false}
          required={true}
          rows={1}
          value={price}
          type={'number'}
          onChange={inputPrice}
        />
        <div className="module-spacer--small" />
        <SetSizeArea sizes={sizes} setSizes={setSizes} />
        <div className="module-spacer--small" />
        <div className="center">
          <PrimaryButton
            label={'商品情報を保存'}
            onClick={() =>
              dispatch(
                saveProduct(
                  id,
                  images,
                  name,
                  description,
                  category,
                  gender,
                  price,
                  sizes
                )
              )
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ProductEdit;
